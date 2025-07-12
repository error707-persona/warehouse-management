import { Decimal } from "@prisma/client/runtime/library";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  imgUrl: string;
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: Decimal;
  rating?: number;
  stockQuantity: number;
  imgUrl?: string | null;
}

interface UpdateSalesPayload {
  id: string;
  data: {
    stockQuantity: number;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  };
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role?: string;
  password?: string;
  message?: string;
  data?: {
    name: string;
    email: string;
  };
}

export interface NewUser {
  name: string;
  email: string;
  role?: string;
}
console.log("Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    // get request -> query
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    // post put update delete -> mutation
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products/createProduct",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    createUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: "/users/addUser",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    editProduct: build.mutation<
      Product,
      { id: string; data: Partial<NewProduct> }
    >({
      query: ({ id, data }) => ({
        url: `/products/updateProduct/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: build.mutation<Product, { id: string }>({
      query: ({ id }) => ({
        url: `/products/deleteProduct/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    getusers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    updateSales: build.mutation<Product, UpdateSalesPayload>({
      query: ({id, data}) => ({
        url: `/products/updateSales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    getOneUser: build.mutation<User, { email: string; password: string }>({
      query: (data) => ({
        url: `/users/getOneUser`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    editUser: build.mutation<User, { id: string; data: Partial<NewUser> }>({
      query: ({ id, data }) => ({
        url: `/users/edit/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: build.mutation<User, { id: string }>({
      query: ({ id }) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: `/users/logout/`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetusersQuery,
  useGetExpensesByCategoryQuery,
  useEditProductMutation,
  useDeleteProductMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useGetOneUserMutation,
  useLogoutMutation,
  useUpdateSalesMutation,
} = api;
