import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "../../(components)/Header";
import { Decimal } from "@prisma/client/runtime/library";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type UpdateProductFormData = {
  name: string;
  price: Decimal;
  stockQuantity: number;
  rating: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
  formValues?: UpdateProductFormData;
  handleEdit?: (formValues: UpdateProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  formValues,
  handleEdit,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({

    name: "",
    price: 0.0,
    stockQuantity: 0,
    imgUrl: "",
    rating: 0,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (formValues && handleEdit) {
      handleEdit(formData);
    } else {
      onCreate(formData);
    }

    setFormData({
      name: "",
      price: 0.0,
      stockQuantity: 0,
      imgUrl: "",
      rating: 0,
    });

    onClose();
  };

  const labelCssStyles = "block mt-5 text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full p-2 my-2 border-gray-500 border-2 rounded-md";

  useEffect(() => {
    if (formValues && isOpen) {
      setFormData(formValues);
    }
  }, [formValues, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 g-gray-600 bg-opacity-50 overflow-y-auto hull w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* product name */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name{" "}
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
            Price{" "}
          </label>
          <input
            type="number"
            name="price"
            step="any"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />
          {/* price  */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock quantity{" "}
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />
          {/* rating  */}
          <label htmlFor="rating" className={labelCssStyles}>
            {" "}
            Rating{" "}
          </label>
          <input
            type="number"
            name="rating"
            max={5}
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
            required
          />
          <div>
            <input
              type="file"
              name="imgUrl"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-black file:text-white file:cursor-pointer hover:file:bg-gray-600 file:mr-2 w-full my-3  rounded"
            />
          </div>

          {/* create actions */}
          <button
            className="px-4 mt-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            {formValues ? "Update" : "Create"}
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

export default CreateProductModal;
