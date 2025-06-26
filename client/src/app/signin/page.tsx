"use client";
import Image from "next/image";
import React from "react";
import loginPic from "../../../public/stock images/Illustration.png";
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "@/state/api";
import { useRouter } from "next/navigation"; 

type SignInFormInputs = {
  name: string;
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>(); 
  const [createUser] = useCreateUserMutation();
  const router = useRouter();

  const onSubmit = async (data: SignInFormInputs) => {
    console.log("SignUp Data:", data);
    const result = await createUser(data);
    if (result && result.data && result.data.message==="User created successfully") {
      router.push("/dashboard");
    }
  };
 

  return (
    <div className="h-[100vh] flex flex-col md:flex-row">
      <div className="hidden lg:block lg:w-1/2 h-full p-32 bg-blue-300 ">
        <Image src={loginPic} alt="" />
      </div>
      <div className="w-full lg:w-1/2 bg-white h-full  flex flex-col justify-center items-center">
     <div className="font-bold text-2xl mb-5">Welcome back to EDSTOCK</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 gap-5 flex flex-col rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-300">
            Sign In
          </h2>
          <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              
              placeholder="Luna Baker"
              {...register("name", { required: "Name is required" })}
              className=" block mb-5 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          <div>
            
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
         
              placeholder="abc@hotmail.com"
              {...register("email", { required: "Email is required" })}
              className=" block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm ">
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
              className=" block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm ">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-300 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
          <div className="text-center">
            Already have an account? <a href="/login">Login</a>
          </div>
          
        </form>
        <div className="mt-2">© 2025 EDSTOCK. All rights reserved. </div>
      </div>
    </div>
  );
};

export default SignIn;
