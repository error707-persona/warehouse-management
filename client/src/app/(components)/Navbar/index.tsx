"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useLogoutMutation, useUserActivityMutation } from "@/state/api";
import { Bell, Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
//  import { Settings } from "lucide-react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [triggerLogout] = useLogoutMutation();
  const router = useRouter();
  const [notifyOpen, setNotifyOpen] = useState<boolean>(false);
  const username = localStorage.getItem("username");
  const [userActivity] = useUserActivityMutation();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const wsRef = useRef<WebSocket | null>(null);
  const [notification, setNotification] = useState<{ [key: string]: string }>(
    {}
  );

  const addLogs = async (action: string | null | undefined, userId: string | null | undefined, userId2: string | null | undefined, username1: string | null | undefined, username2: string | null | undefined) => {
    await userActivity({
      action,
      userId,
      userId2,
      username1,
      username2,
    });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      var curDate = new Date();
      const timestamp = curDate.toISOString();
      console.log("Date: ", timestamp);

      setNotification((prev) => ({
        ...prev,
        [timestamp]: event.data + username,
      }));
      console.log("🔔 Notification:", event.data + username);
      // addLogs(event.data + username, "", "", username, "");
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    // Cleanup on unmount
    // return () => {
    //   if (wsRef.current) {
    //     wsRef.current.close();
    //   }
    // };
  }, []);

  useEffect(() => {
    console.log("🆕 Notification updated: ", notification);
  }, [notification]);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  const handleLogout = async () => {
    await triggerLogout().unwrap();
    router.push("/login");
  };

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
          <div></div>
          <div className="relative">
            <div
              className="relative"
              onClick={() => setNotifyOpen(!notifyOpen)}
            >
              <Bell
                className="cursor-pointer text-gray-500 dark:text-white"
                size={24}
              />
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
                3
              </span>
            </div>
            <div
              className={`border-2 absolute -left-25 bg-white p-5 top-10 rounded-lg ${
                notifyOpen ? "block" : "hidden"
              }`}
              style={{ width: "200px" }}
            >
              {Object.entries(notification).map(([key, value]) => (
                <div key={key}>
                  <div className="py-3">{value}</div>
                  <hr />
                </div>
              ))}
            </div>
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
            <span className="font-semibold dark:text-white">
              Hi, {username}
              <button className="ml-2 text-red-600" onClick={handleLogout}>
                Logout
              </button>
            </span>
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
