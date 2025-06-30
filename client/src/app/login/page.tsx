"use client";
import Image from "next/image";
import React from "react";
import loginPic from "../../../public/stock images/Illustration.png";
import { useForm } from "react-hook-form";
import { useGetOneUserMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [getOneUser, { isLoading }] = useGetOneUserMutation();
  const onSubmit = async (inputData: LoginFormInputs) => {
    try {
      const result = await getOneUser(inputData).unwrap();
      if (result && result.message === "Login user successfully") {
        localStorage.setItem("username", result.data.name);
        localStorage.setItem("email", result.data.email);
        router.push("/dashboard");
      }
    } catch (error) {
      alert(
        "Something went wrong when you were trying to login, Please try again later!"
      );
      console.log(error);
    }
  };
  

  return (
    <div className="h-[100vh] flex flex-col md:flex-row border-2 ">
      <div className="hidden lg:block lg:w-1/2 h-full p-32 bg-purple-500">
        <Image src={loginPic} alt="" />
      </div>
      <div className="w-full lg:w-1/2 mt-10 md:mt-0 h-full bg-white  flex flex-col justify-center items-center">
        <div className="font-bold text-2xl mb-16">Welcome back to EDSTOCK</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg  border-black shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center text-purple-600">
            Login
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="abc@hotmail.com"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-700 focus:border-purple-700"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-700 focus:border-purple-700"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center hover:bg-purple-900 bg-purple-700 text-white py-2 px-4 rounded transition"
          >
            {" "}
            {isLoading ? <Loader /> : "Login"}
          </button>
          <div className="text-center">
            Dont have an account? <a href="/signin">Sign In</a>
          </div>
        </form>
        <div className="mt-2">© 2025 EDSTOCK. All rights reserved. </div>
      </div>
    </div>
  );
};

export default Login;
