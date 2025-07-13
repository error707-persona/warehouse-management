"use client";

import {
  useEditProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateSalesMutation,
} from "@/state/api";
import Header from "../../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import {
  Minus,
  PencilIcon,
  Plus,
  SearchIcon,
  ShoppingCart,
  Trash,
  Undo2,
} from "lucide-react";

import { useState } from "react";
import CreateProductModal from "../products/CreateProductModal";

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [editProduct] = useEditProductMutation();
  const [updateSales] = useUpdateSalesMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [values, setvalues] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const updatedProducts = products?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [orderedMap, setOrderedMap] = useState<{ [productId: string]: number }>(
    { 0: 0 }
  );
  const increase = (productId: string) => {
    setOrderedMap((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decrease = (productId: string) => {
    setOrderedMap((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 270 },
    { field: "name", headerName: "Product Name", width: 170 },
    {
      field: "price",
      headerName: "Price",
      width: 70,
      type: "number",
      valueGetter: (value, row) => `${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 70,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 100,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => {
        const ordered = orderedMap[params.row.productId] || 0;

        return (
          <Box className="flex justify-center gap-1 items-center h-full w-full">
            <button
              className="text-blue-600 hover:bg-blue-100 p-2 rounded"
              onClick={() => handleHelper(params.row)} title="Edit product details"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              className="text-red-600 hover:bg-red-100 p-2 rounded"
              onClick={() => handleDeleteHelper(params.row)} title="Delete product"
            >
              <Trash className="w-6 h-6" />
            </button>
            <div className="flex ml-5">
              <div className="flex">
                <div className="flex justify-center items-center gap-3 ">
                  <Minus
                    className="w-5 h-5 hover:bg-black-100 cursor-pointer"
                    onClick={() => decrease(params.row.productId)}
                  />
                  {ordered}
                  <Plus
                    className="w-5 h-5 hover:bg-black-100 cursor-pointer"
                    onClick={() => increase(params.row.productId)}
                  />
                </div>
                <button
                  onClick={() => handleSales(params.row, true)}
                  className="p-2" title="Execute orders"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>

                <button onClick={() => handleSales(params.row, false)} title="Return orders">
                  <Undo2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Box>
        );
      },
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHelper = (params: any) => {
    setisModalOpen(true);
    setvalues(params);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteHelper = (params: any) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (confirm) {
      handleDelete(params); // your function to call on OK
    }
  };

  const handleEdit = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
    selectedFileName: string | null
    // selectedFile: File | null
  ) => {
    console.log("entered call to api", params);
    console.log("selectedFile: ", selectedFileName);
    await editProduct({
      id: params?.productId,
      data: {
        name: params?.name,
        price: params?.price,
        rating: params?.rating,
        stockQuantity: params?.stockQuantity,
        imgUrl: selectedFileName?.split("\\")[-1],
      },
    });
    console.log("call to api is done");
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (params: any) => {
    console.log("entered DELETE call to api", params);
    await deleteProduct({
      id: params?.productId,
    });
    console.log("call to delete api is done");
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSales = async (params: any, isOrder: boolean) => {
    const orders = orderedMap[params?.productId];
    console.log("product id: ", params?.productId);
    console.log(
      "product id: ",
      params?.stockQuantity,
      orders,
      params?.price,
      orders * params?.price
    );

    let stockQuantity = 0;
    let unitPrice = Number(params?.unitPrice);
    let totalAmount = 0;
    if (isOrder) {
      stockQuantity = params?.stockQuantity - orders;
      unitPrice = Number(params?.unitPrice);
      totalAmount = orders * params?.price;
    } else {
      stockQuantity = params?.stockQuantity + orders;
      unitPrice = -Number(params?.unitPrice);
      totalAmount = -(orders * params?.price);
    }

    await updateSales({
      id: params?.productId,
      data: {
        stockQuantity: stockQuantity,
        quantity: orders,
        unitPrice: unitPrice || 0,
        totalAmount: totalAmount,
      },
    });
  };

  return (
    <div className="flex flex-col dark:bg-slate-900">
      <Header name="Inventory" />
      <div className="w-full flex gap-2 mt-2 md:items-center rounded bg-white border-2 dark:bg-slate-900">
        <SearchIcon className="w-5 h-5 text-gray-500 m-2 dark:text-white" />
        <input
          type="text"
          className="w-full outline-none rounded bg-white dark:bg-slate-900 dark:text-white"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataGrid
        rows={updatedProducts}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700 dark:bg-slate-800"
      />
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        onCreate={() => {}}
        formValues={values}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Inventory;
