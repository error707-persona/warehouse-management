"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useLogoutMutation } from "@/state/api";
import { Bell, Menu, Moon, Sun } from "lucide-react";
// import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Image from "next/image";
//  import { Settings } from "lucide-react";
 
const Navbar = () => {
  const dispatch = useAppDispatch();
  const [triggerLogout] = useLogoutMutation();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode))
  }
  const handleLogout = async () => {
    await triggerLogout().unwrap();
     router.push("/login");
  }
  const username = localStorage.getItem("username");
  return (
    <div className="flex dark:bg-slate-800 justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4 dark:text-white " />
        </button>

        
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            {/* <button
            onClick={toggleDarkMode}
            >
              {isDarkMode ? (
              <Sun className="cursor-pointer text-gray-500 dark:text-white" size={24} />
            ) : (
              <Moon className="cursor-pointer text-gray-500 dark:text-white" size={24} />
            )}
            </button> */}
          </div>
          <div className="relative">
            <Bell className="cursor-pointer text-gray-500 dark:text-white" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div>
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            {/* <Image
            src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/profile.jpg"
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full h-full object-cover"
          /> */}
            <span className="font-semibold dark:text-white">Hi, {username}<button className="ml-2 text-red-600" onClick={handleLogout}>Logout</button></span>
          </div>
        </div>
        {/* <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500 dark:text-white" size={24} />
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
