"use client";

import {
  useEditProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/state/api";
import Header from "../../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { PencilIcon, Trash } from "lucide-react";

import { useState } from "react";
import CreateProductModal from "../products/CreateProductModal";

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [editProduct] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [values, setvalues] = useState();
  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 300 },
    { field: "name", headerName: "Product Name", width: 300 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      valueGetter: (value, row) => `${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box className="flex justify-center items-center h-full w-full">
          <Button
            size="small"
            onClick={() => handleHelper(params.row)}
            style={{ marginRight: 8 }}
            className=""
          >
            <PencilIcon className="w-6 h-6" />
          </Button>
          <Button
            color="error"
            size="small"
            onClick={() => handleDeleteHelper(params.row)}
          >
            <Trash className="w-6 h-6" />
          </Button>
        </Box>
      ),
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = async (params: any) => {
    console.log("entered call to api", params);
    await editProduct({
      id: params?.productId,
      data: {
        name: params?.name,
        price: params?.price,
        rating: params?.rating,
        stockQuantity: params?.stockQuantity,
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

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
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
