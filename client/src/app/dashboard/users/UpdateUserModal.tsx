import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "../../(components)/Header";

type UserFormData = {
  name: string;
  email: string;
};

type UpdateUserFormData = {
  userId: string;
  name: string;
  email: string;
  role?: string | undefined;
};

type UpdateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: UserFormData) => void;
  formValues?: UpdateUserFormData;
  handleEdit?: (formValues: UpdateUserFormData) => void;
};

const UpdateUserModal = ({
  isOpen,
  onClose,
  onCreate,
  formValues,
  handleEdit,
}: UpdateUserModalProps) => {
  const [formData, setFormData] = useState<UpdateUserFormData>({
    userId: v4(),
    name: "",
    email: "",
    role: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("formData: ", formData);
    if (formValues && handleEdit) {
      handleEdit(formData);
    } else {
      onCreate(formData);
    }
    onClose();
  };

  const labelCssStyles =
    "block mt-5 text-sm font-medium text-gray-700 dark:text-white";
  const inputCssStyles =
    "block w-full p-2 my-2 border-gray-500 border-2 rounded-md dark:bg-gray-600 dark:text-white dark:border-none";

  useEffect(() => {
    if (formValues && isOpen) {
      setFormData(formValues);
    }
  }, [formValues, isOpen]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    console.log("name: ", name, "value: ", value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 g-gray-600 bg-opacity-50 overflow-y-auto hull w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-slate-800">
        <Header name="Create User" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* product name */}
          <div className="flex flex-col ">
            <label htmlFor="productName" className={labelCssStyles}>
              Name{" "}
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
              className={inputCssStyles}
              required
            />
            {/* price  */}
            <label htmlFor="Price" className={labelCssStyles}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className={inputCssStyles}
              required
            />
            <label htmlFor="Price" className={labelCssStyles}>
              Role
            </label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              className="p-3 w-full outline-none my-3 border-2 dark:border-none rounded border-gray-600 dark:bg-gray-600 dark:border-gray-400 dark:text-white"
            >
              <option value="Inventory Clerk">Inventory Clerk</option>
              <option value="Admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {/* create actions */}
          <button
            className="px-4 mb-3 mt-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Create
          </button>
          <button
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            type="submit"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
