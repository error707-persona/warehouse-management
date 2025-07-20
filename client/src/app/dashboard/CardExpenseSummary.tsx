import {
  ExpenseByCategorySummary,
  useGetDashboardMetricsQuery,
} from "@/state/api";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import Loader from "../(components)/Loader";

const colors = ["#00C49F", "#0088FE", "#FFBB28"];

type ExpenseSums = {
  [category: string]: number;
};

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();
  const expenseByCategorySummary =
    dashboardMetrics?.expenseByCategorySummary || [];

  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = parseInt(item.amount, 10);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category: { value: number }) => acc + category.value,
    0
  );

  const formattedTotalExpenses = totalExpenses.toFixed(2);
  // const expenseSummary = dashboardMetrics?.expenseSummary[0];
  return (
    <div className="shadow-md max-h-fit bg-white dark:text-white dark:border-none dark:bg-gray-800 flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 shadow-mf rounded-2xl">
      {isLoading ? (
        <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-md font-semibold mb-2 px-7 mt-5">
              Expense Summary
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div className="justify-between">
            {/* chart */}
            <div className="flex mb-3">
              <ResponsiveContainer width={180} height={130}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  />
                  {expenseCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute translate-x-16 translate-y-16  text-center">
                <span className="font-bold text-xl">
                  ${formattedTotalExpenses}
                </span>
              </div>
              {/* LABELS */}
              <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
                {expenseCategories.map((entry, index) => (
                  <li
                    key={`legend-${index}`}
                    className="flex items-center font-semibold text-xs"
                  >
                    <span
                      className=" w-3 h-3 mr-2 rounded-full"
                      style={{
                        backgroundColor: colors[index % colors.length],
                      }}
                    >
                      
                    </span>
                    {entry.name}
                  </li>
                ))}
              </ul>
            </div>
            {/* footer */}
            <div>
              <hr />
              {/* {expenseSummary && (
                <div className="flex justify-between items-center px-7 mb-4">
                  <div className="pt-2">
                    <p className="text-sm">
                      Average:{" "}
                      <span className="font-semibold">
                        ${expenseSummary.totalExpenses.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <span className="flex itemse-center mt-2">
                    <TrendingUp className="mr-2 text-green-500" />
                    30%
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
