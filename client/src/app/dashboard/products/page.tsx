"use client";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Rating from "../../(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import { Decimal } from "@prisma/client/runtime/binary";
import { supabase } from "../../utils/supabaseClient";
import Image from "next/image";

type ProductFormData = {
  name: string;
  price: Decimal;
  stockQuantity: number;
  rating: number;
  imgUrl?: string | null;
};

const Products = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [isModalOpen, setisModalOpen] = useState(false);
  const { data: products, isError } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const imageMap = new Map();
  const handleCreateProduct = async (
    productData: ProductFormData,
    selectedFileName: string | null,
    selectedFile: File | null
  ) => {
    console.log(
      "productData: ",
      productData,
      "selectedFileName: ",
      selectedFileName,
      "selectedFile: ",
      selectedFile
    );
    productData.imgUrl = selectedFileName;
    const result = await createProduct(productData);
    const product_id = result.data?.productId;
    const filePath = `products/${product_id}/${selectedFileName}`; // Optional: folder per product ID

    if (selectedFile !== null) {
      const user = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.storage
          .from("product-images") // your storage bucket name
          .upload(filePath, selectedFile);

        if (error) throw error;

        await supabase
          .from("products")
          .update({
            image_path: filePath,
          })
          .eq("id", product_id);
      }
    }
  };

  if (!products) {
    console.log(isError, "isError");
    return <div className="py-4"> Loading...</div>;
  }

  if (isError || !products) {
    console.log(isError, "iserror");
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  if (products) {
    for (const product of products) {
      if (product.imgUrl) {
        const filePath = `products/${product.productId}/${product?.imgUrl}`;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageMap.set(product.productId, urlData.publicUrl);
      }
    }
    console.log("imageMap: ", imageMap);
  }

  console.log("products: ", products);

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="flex  justify-center gap-10 w-full items-center mb-6">
        <div className="w-full border-2 flex gap-2 items-center rounded bg-white">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            type="text"
            className="w-full outline-none rounded bg-white"
            placeholder="Search products...this search is case sensitive"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-72 justify-between items-center">
          {/* <Header name="Products"> */}
          <button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 ml-auto px-4 rounded"
            onClick={() => setisModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
            Create Product
          </button>
          {/* </Header> */}
        </div>
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {!products ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                {product.imgUrl ? (
                  <Image src={imageMap.get(product.productId)} alt="" width={200} height={200} className="w-56 h-56"/>
                ) : (
                  "img"
                )}
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock : {product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* modal */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        onCreate={handleCreateProduct}
        handleEdit={() => {}}
      />
    </div>
  );
};

export default Products;
