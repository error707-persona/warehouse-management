import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../(components)/Loader";

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = data?.purchaseSummary || [];
  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;
  return (
    <div className="shadow-md bg-white dark:text-white dark:bg-gray-800 flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 shadow-mf rounded-2xl">
      {isLoading ? (
        <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-md font-semibold mb-2 px-7 pt-5">
              Purchase Summary
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div className="">
            <div className="flex gap-2 mb-4 mt-4 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-md font-bold">
                  {lastDataPoint
                    ? numeral(lastDataPoint.totalPurchased).format("$0.00a")
                    : "0"}
                </p>
              </div>
              {lastDataPoint && (
                <p
                  className={`text-sm ${
                     (lastDataPoint.changePercentage ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } flex `}
                >
                  { (lastDataPoint.changePercentage ?? 0) >= 0 ? (
                    <TrendingUp className="w-4 h-5 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-5 mr-1" />
                  )}
                </p>
              )}
              {(lastDataPoint) && Math.abs( lastDataPoint.changePercentage ?? 0)}%
            </div>
            {/* CHART */}
            <ResponsiveContainer width="100%" height={168} className="px-5">
              <AreaChart
                data={purchaseData}
                margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
              >
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis tickLine={false} tick={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  type="linear"
                  dataKey="totalPurchased"
                  stroke="#8884d9"
                  fill="#8884d9"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
