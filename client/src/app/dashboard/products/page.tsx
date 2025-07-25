"use client";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Rating from "../../(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import { Decimal } from "@prisma/client/runtime/binary";
import { supabase } from "../../utils/supabaseClient";
import Loader from "@/app/(components)/Loader";

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
  const updatedProducts = products?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [createProduct] = useCreateProductMutation();
  const imageMap = new Map();

  const handleCreateProduct = async (
    productData: ProductFormData,
    selectedFileName: string | null,
    selectedFile: File | null
  ) => {
    // console.log(
    //   "productData: ",
    //   productData,
    //   "selectedFileName: ",
    //   selectedFileName,
    //   "selectedFile: ",
    //   selectedFile
    // );
    productData.imgUrl = selectedFileName;
    const result = await createProduct(productData);
    const product_id = result.data?.productId;
    const filePath = `products/${product_id}/${selectedFileName}`; // Optional: folder per product ID

    if (selectedFile !== null) {
      const user = await supabase.auth.getUser();
      if (user) {

        console.log("filePath before uploading: ", filePath);

        const { error } = await supabase.storage
          .from("product-images") 
          .upload(filePath, selectedFile);
        console.log("error: ", error)
        if (error) throw error;

        // await supabase
        //   .from("products")
        //   .update({
        //     image_path: filePath,
        //   })
        //   .eq("id", product_id);
      }
    }
  };

  if (!products) {
    // console.log(isError, "isError");
    return <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>;
  }

  if (isError || !products) {
    // console.log(isError, "iserror");
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  if (products) {
    console.log("supabase: ", supabase);
    console.log("products: ",products)
    for (const product of products) {
      console.log("product.Url: ", product.imgUrl);
      if (product.imgUrl) {
        const filePath = `products/${product.productId}/${product?.imgUrl}`;
        console.log("filePath: ", filePath, "product.productId: ",product.productId);

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        console.log(
          "product id: ",
          product.productId,
          "url: ",
          urlData.publicUrl
        );
        imageMap.set(product.productId, urlData.publicUrl);
      }
    }
    // console.log("imageMap: ", imageMap);
  }

  return (
    <div className="mx-auto pb-5 md:w-full dark:bg-slate-800">
      <div className="flex md:justify-center gap-10 w-15 md:w-full items-center mb-6">
        <div className="w-full flex gap-2 md:items-center rounded bg-white border-2 dark:bg-slate-900">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2 dark:text-white" />
          <input
            type="text"
            className="w-full outline-none rounded bg-white dark:bg-slate-900 dark:text-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
        </div>

        <div className="flex lg:w-72  justify-between items-center">
          {/* <Header name="Products"> */}
          <button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 ml-auto px-2 md:px-4 rounded"
            onClick={() => setisModalOpen(true)}
          >
            <div className="hidden md:flex">
              <PlusCircleIcon className="w-5 h-5 md:mr-2 !text-gray-200" />
              Create Product
            </div>
            <div className="md:hidden">
              <PlusCircleIcon className="w-5 h-5 md:mr-2 !text-gray-200" />
            </div>
          </button>
          {/* </Header> */}
        </div>
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {!updatedProducts ? (
          <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>
        ) : (
          updatedProducts?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto dark:border-none  dark:bg-slate-900"
            >
              <div className="flex flex-col items-center ">
                {product.imgUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageMap.get(product.productId)}
                    alt=""
                    width={200}
                    height={200}
                    className="w-56 h-56"
                  />
                ) : (
                  "img"
                )}
                <h3 className="text-lg text-gray-900 font-semibold dark:text-white">
                  {product.name}
                </h3>
                <p className="text-gray-800 dark:text-white">
                  ${product.price.toFixed(2)}
                </p>
                <div className="text-sm text-gray-600 mt-1 dark:text-white">
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
