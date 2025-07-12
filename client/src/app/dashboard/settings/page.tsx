"use client";
import React, { useEffect, useState } from "react";
import Header from "../../(components)/Header";

type UserSetting = {
  label: string;
  value: string | boolean | null;
  type: "text" | "toggle";
};

const username = localStorage.getItem("username");
const email = localStorage.getItem("email");

const mockSetting: UserSetting[] = [
  { label: "Username", value: username, type: "text" },
  { label: "Email", value: email, type: "text" },
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  // { label: "Language", value: "English", type: "text" },
];

const Settings = () => {
  const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSetting);
    const [dark, setDark] = useState(false);

  console.log(userSettings)
  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    // console.log(settingsCopy[index].value, "onchange on toggle");
    setUserSettings(settingsCopy);
  };


  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="w-full dark:bg-gray-900 dark:text-white">
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-800 dark:bg-purple-900 ">
            <tr>
              <th className="text-left text-white py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left text-white py-3 px-4 uppercase font-semibold text-sm">
                Value 
              </th>
            </tr>
          </thead>
          <tbody className="dark:bg-gray-800">
            {userSettings.map((settings, index) => (
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-800" key={settings.label}>
                <td className="py-2 px-4">{settings.label}</td>
                <td className="py-2 px-4">
                  {settings.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer border-2 "
                        checked={settings.value as boolean}
                        onChange={() => handleToggleChange(index)}
                         onClick={() => {settings.label === "Dark Mode" ? setDark(!dark): ""}}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border dark:text-white dark:bg-slate-700 dark:border-none rounded-lh text-gray-500 foocus-outline-none focus:border-blue-500"
                      value={settings.value as string}
                      onChange={(e) => {
                        const settingsCopy = [...userSettings];
                        settingsCopy[index].value = e.target.value;
                        setUserSettings(settingsCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
