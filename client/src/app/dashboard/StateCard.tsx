
import { LucideIcon } from "lucide-react";
import React, { JSX } from "react";

type StateDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StateCardProps = {
  title: string;
  primaryIcon: JSX.Element;
  details: StateDetail[];
  dateRange: string;
};
const StateCard = ({
  title,
  primaryIcon,
  details,
  dateRange,
}: StateCardProps) => {
  const formatPercentage = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed()}%`;
  };
  const getChangeColor = (value: number) =>
    value >= 0 ? "text-green-500" : "text-red-500";
  return (
    <div className="md:row-span-1 h-50 xl:row-span-2 bg-white col-span-1 shadow-md rounded-2xl flex flex-col dark:text-white dark:bg-gray-800">
      {/* header */}
      <div>
        <div className="flex justify-between items-center px-5">
          <h2 className="font-semibold text-md text-gray-700 dark:text-white py-3">{title}</h2>
          <span className="text-xs text-gray-400 dark:text-white">{dateRange}</span>
        </div>
        <hr />
      </div>

      {/* body */}
      <div className="flex mb-6 items-center justify-around gap-4 px-5 my-auto">
        <div className="rounded-full p-5 bg-blue-50 border-sky-300 border-[1px]">
          {primaryIcon}
        </div>
        <div className="flex-1 my-auto">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center justify-between my-2">
                <span className="text-gray-500 text-xs dark:text-white">{detail.title}</span>
                <span className="font-bold text-gray-800 dark:text-white ml-auto mr-2">{detail.amount}</span>
                <div className="flex items-center">
                  <detail.IconComponent
                    className={`w-4 h-4 mr-1 ${getChangeColor(
                      detail?.changePercentage
                    )}`}
                  />
                  <span
                    className={`font-medium ${getChangeColor(
                      detail?.changePercentage
                    )}`}
                  >
                    {formatPercentage(detail?.changePercentage)}
                  </span>
                </div>
              </div>
              {index < details.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateCard;
