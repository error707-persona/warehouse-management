"use client";

import {
  useDeleteUserMutation,
  useEditUserMutation,
  useGetusersQuery,
} from "@/state/api";
import Header from "../../(components)/Header";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { PencilIcon, SearchIcon, Trash } from "lucide-react";
import { useState } from "react";
import UpdateUserModal from "./UpdateUserModal";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/app/(components)/Loader";

const DataGrid = dynamic(() =>
  import('@mui/x-data-grid').then((mod) => mod.DataGrid),
  {
    ssr: false,
    loading: () => <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>,
  }
);

const Users = () => {
  const { data: users, isError, isLoading } = useGetusersQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cleanedUsers = users?.map(({ password, ...rest }) => rest);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setisModalOpen] = useState(false);
  const [values, setvalues] = useState();
  const updatedUsers = cleanedUsers?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  if (role != "Admin") {
    redirect("/dashboard");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHelper = (params: any) => {
    setisModalOpen(true);
    console.log("params 1-2: ", params);
    setvalues(params);
    console.log("onchange: ", values);
  };

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
          className="flex justify-center items-center h-full w-full "
          onClick={() => handleHelper(params.row)}
        >
          <select
            name="role"
            id="role"
            className="p-3 w-fit"
            disabled
            value={params.row.role}
          >
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
  const [editUser] = useEditUserMutation();
  const [deleteUser] = useDeleteUserMutation();

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

  if (isLoading) {
    return <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>;
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
      <div className="w-full flex gap-2 mt-2 md:items-center rounded bg-white border-2 dark:bg-slate-900">
        <SearchIcon className="w-5 h-5 text-gray-500 m-2 dark:text-white" />
        <input
          type="text"
          className="w-full outline-none rounded bg-white dark:bg-slate-900 dark:text-white"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DataGrid
        rows={updatedUsers}
        columns={columns}
        getRowId={(row) => row.userId}
        // checkboxSelection
        disableRowSelectionOnClick={false}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700 dark:bg-slate-800 dark:text-white"
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
