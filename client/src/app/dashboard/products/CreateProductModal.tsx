import React, { useEffect, useState } from "react";
// import { v4 } from "uuid";
import Header from "../../(components)/Header";
import { Decimal } from "@prisma/client/runtime/library";
import { useForm } from "react-hook-form";

type ProductFormData = {
  name: string;
  price: Decimal;
  stockQuantity: number;
  rating: number;
  imgUrl?: string | null;
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
  onCreate: (formData: ProductFormData, selectedFileName: string, selectedFile: File | null) => void;
  formValues?: UpdateProductFormData;
  handleEdit?: (formValues: UpdateProductFormData, selectedFileName: string, selectedFile: File | null) => void;
};

type FormData = {
  name: string;
  price: Decimal;
  stockQuantity: number;
  rating: number;
  imgUrl: string;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  formValues,
  handleEdit,
}: CreateProductModalProps) => {
  // const [formData, setFormData] = useState({

  //   name: "",
  //   price: 0.0,
  //   stockQuantity: 0,
  //   imgUrl: "",
  //   rating: 0,
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedNameFile, setSelectedNameFile] = useState("");
  const onSubmit = (formData: FormData) => {
    console.log(formData);
    if (formValues && handleEdit) {
      handleEdit(formData, selectedNameFile, selectedFile);
    } else {
      onCreate(formData, selectedNameFile, selectedFile);
    }
    reset();
    onClose();
  };

  const labelCssStyles = "block mt-5 text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full p-2 my-2 border-gray-500 border-2 rounded-md";

  useEffect(() => {
    if (formValues && isOpen) {
      reset(formValues);
    }
  }, [formValues, isOpen, reset]);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]:
  //       name === "price" || name === "stockQuantity" || name === "rating"
  //         ? parseFloat(value)
  //         : value,
  //   });
  // };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 g-gray-600 bg-opacity-50 overflow-y-auto hull w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          {/* product name */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name{" "}
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            name="name"
            placeholder="Name"
            className={inputCssStyles}
            required
          />
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name.message}</span>
          )}
          {/* price  */}
          <label htmlFor="Price" className={labelCssStyles}>
            Price{" "}
          </label>
          <input
            {...register("price", {
              required: "Price is required",
              min: { value: 0.01, message: "Price must be a positive number" },
            })}
            type="number"
            name="price"
            step="any"
            placeholder="Price"
            className={inputCssStyles}
            required
          />
           {errors.price && <span style={{ color: "red" }}>{errors.price.message}</span>}
          {/* price  */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock quantity{" "}
          </label>
          <input
            {...register("stockQuantity", {
              required: "Stock quantity is required",
              min: { value: 1, message: "Stock quantity must be a positive number" },
              max: { value: 1000, message: "Stock quantity must be a positive number" },
            })}
            type="number"
            name="stockQuantity"
            placeholder="Stock quantity"
            className={inputCssStyles}
            required
          />
           {errors.stockQuantity && <span style={{ color: "red" }}>{errors.stockQuantity.message}</span>}
          {/* rating  */}
          <label htmlFor="rating" className={labelCssStyles}>
            {" "}
            Rating{" "}
          </label>
          <input
           {...register("rating", {
              required: "Rating is required",
              min: { value: 1, message: "Rating must be a positive number" },
              max: { value: 5, message: "Price must be a less than equal to 5" },
            })}
            type="number"
            name="rating"
            max={5}
            placeholder="Rating"
            className={inputCssStyles}
            required
          />
           {errors.rating && <span style={{ color: "red" }}>{errors.rating.message}</span>}
          <div>
            <input
            {...register("imgUrl")}
              type="file"
              name="imgUrl"
              accept="image/png, image/jpeg"
               onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file); 
                  setSelectedNameFile(file.name);
                }
              }}
              className="file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-black file:text-white file:cursor-pointer hover:file:bg-gray-600 file:mr-2 w-full my-3 rounded"
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
