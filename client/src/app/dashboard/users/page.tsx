"use client";

import {
  useDeleteUserMutation,
  useEditUserMutation,
  useGetusersQuery,
} from "@/state/api";
import Header from "../../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { PencilIcon, Trash } from "lucide-react";
import { useState } from "react";
import UpdateUserModal from "./UpdateUserModal";

const Users = () => {
  const { data: users, isError, isLoading } = useGetusersQuery();
  const cleanedUsers = users?.map(({ password, ...rest }) => rest);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [values, setvalues] = useState();
  const [editUser] = useEditUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 300 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "role",
      headerName: "role",
      width: 100,
      type: "number",
      renderCell: (params) => (
        <Box
          className="flex justify-center items-center h-full w-full"
          onClick={() => handleHelper(params.row)}
        >
          <select name="role" id="role" className="p-3 w-fit" disabled>
            <option value="Inventory Clerk">Inventory Clerk</option>
            <option value="Admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box className="flex items-center h-full w-full">
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
    console.log("params 1-2: ", params);
    setvalues(params);
    console.log("onchange: ", values);
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
    await editUser({
      id: params?.userId,
      data: {
        name: params?.name,
        email: params?.email,
        role: params?.role,
      },
    });
    console.log("call to api is done");
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (params: any) => {
    console.log("entered DELETE call to api", params?.userId);
    await deleteUser({
      id: params?.userId,
    });
    console.log("call to delete api is done");
  };

  console.log(users, "users");
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <Header name="Users" />
      <DataGrid
        rows={cleanedUsers}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
      <UpdateUserModal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        onCreate={() => {}}
        formValues={values}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Users;
