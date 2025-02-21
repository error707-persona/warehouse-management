"use client";
import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "../(components)/Header";
import Rating from "../(components)/Rating";
import CreateProductModal from "./CreateProductModal";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [isModalOpen, setisModalOpen] = useState(false);
  const {
    data: products,
    // isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
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

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="flex  justify-center gap-10 w-full items-center mb-6">
        <div className="w-full border-2 flex gap-10 items-center rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            type="text"
            className="w-full outline-none rounded bg-white"
            placeholder="Search products..."
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
                img
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
      />
    </div>
  );
};

export default Products;
