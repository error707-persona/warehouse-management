import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import { supabase } from "../utils/supabaseClient";
import Loader from "../(components)/Loader";

const CartPopularProducts = () => {
  const imageMap = new Map();
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();
  if (dashboardMetrics?.popularProducts) {
    for (const product of dashboardMetrics?.popularProducts) {
      if (product.imgUrl) {
        const filePath = `products/${product.productId}/${product?.imgUrl}`;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageMap.set(product.productId, urlData.publicUrl);
      }
    }
    // console.log("imageMap: ", imageMap);
  }
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16 dark:text-white dark:bg-gray-800">
      {isLoading ? (
        <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>
      ) : (
        <div className="h-full">
          <h3 className="text-md font-semibold px-7 pt-5 pb-2 ">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-y-scroll no-scrollbar h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 py-2 px-2  border-b"
              >
                <div className="flex items-center gap-3">
                  <div>
                   {  // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageMap.get(product.productId)} className="object-cover max-h-30" width={50} height={50} alt="img"></img>
                   }
                  </div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700 dark:text-white">
                      {product.name}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="fontbold text-blue-500 text-xs">
                        ${product.price}
                      </span>
                      <span className="mx-2">|</span>
                      <Rating rating={product.rating || 0} />
                    </div>
                  </div>
                </div>
                <div className="text0xs flex flex-col justify-center items-center text-sm">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {Math.round(product.stockQuantity / 1000)}k Sold
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPopularProducts;
