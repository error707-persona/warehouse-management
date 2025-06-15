"use client";
import Image from "next/image";
import React from "react";
import loginPic from "../../../public/stock images/Illustration.png";
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "@/state/api";

type SignInFormInputs = {
 name: string;
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>(); 
  const [createUser] = useCreateUserMutation();
  
  const onSubmit = async (data: SignInFormInputs) => {
    console.log("Login Data:", data);
    await createUser(data);
  };
 

  return (
    <div className="h-[100vh] flex">
      <div className="w-1/2 h-full p-32 bg-slate-300 ">
        <Image src={loginPic} alt="" />
      </div>
      <div className="w-1/2 h-full  flex flex-col justify-center items-center">
     <div className="font-bold text-2xl mb-16">Welcome back to EDSTOCK</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg border-2 border-black shadow-md w-full max-w-sm space-y-4"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full border-2 border-black bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Login
          </button>
          <div className="text-center">
            Don't have an account? <a href="/signIn">Sign In</a>
          </div>
          
        </form>
        <div className="mt-2">© 2025 EDSTOCK. All rights reserved. </div>
      </div>
    </div>
  );
};

export default Login;
