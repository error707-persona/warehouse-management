"use client"

import React from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapse = useAppSelector((state)=>state.global.isSidebarCollapsed)
  
  return (
    <div className={`flex bg-gray-50 text-gray-900 w-full min-h-screen dark:bg-slate-900`}>
      <Sidebar />
      <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${isSidebarCollapse?"md:pl-24":"md:pl-72"} `}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    
      <DashboardLayout>{children}</DashboardLayout>

  );
};

export default DashboardWrapper;
