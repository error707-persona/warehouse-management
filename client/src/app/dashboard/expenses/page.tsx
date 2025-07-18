"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import Header from "../../(components)/Header";
import { Cell, Legend, Pie, ResponsiveContainer, Tooltip } from "recharts";
import dynamic from "next/dynamic";
import Loader from "@/app/(components)/Loader";

const PieChart = dynamic(() =>
  import('recharts').then((mod) => mod.PieChart),
  {
    ssr: false,
    loading: () => <p>Loading chart...</p>,
  }
);

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectCategory, setSelectCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const {
    data: expenseData,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();

  const expenses = useMemo(() => expenseData ?? [], [expenseData]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    const filtered: AggregatedData = expenses
      .filter((data: ExpenseByCategorySummary) => {
        const matchedCategory =
          selectCategory === "All" || data.category === selectCategory;
        const dataDate = parseDate(data.date);
        const matchesDate =
          !startDate ||
          !endDate ||
          (dataDate >= startDate && dataDate <= endDate);
        return matchedCategory && matchesDate;
      })
      .reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
        const amount = parseInt(data.amount);
        if (!acc[data.category]) {
          acc[data.category] = { name: data.category, amount: 0 };
          acc[data.category].color = `#${Math.floor(
            Math.random() * 16777215
          ).toString(16)}`;
          acc[data.category].amount += amount;
        }
        return acc;
      }, {});
    return Object.values(filtered);
  }, [expenses, selectCategory, startDate, endDate]);

  const classNames = {
    label: "block text-s font-medium text-gray-700 dark:text-white",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gay-300 focus:ring-indigo-500 sm:text-sm rounded-md dark:text-white dark:bg-slate-700",
  };
  if (isLoading) {
    return <div className="m-5 w-full h-full flex justify-center items-center"><Loader/></div>;
  }
  if (isError || !expenseData) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="mb-5 dark:bg-slate-900">
        <Header name="Expenses"></Header>
        <p className="text-sm text-gray-500 dark:text-white">
          A visual representation of expenses over time
        </p>
      </div>
      {/* filter */}
      <div className="dark:bg-slate-900">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6 dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold mb-4  ">
              Filter by category and date
            </h3>
            <div className="space-y-4">
              {/* category */}
              <div>
                <label htmlFor="category" className={classNames.label}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className={classNames.selectInput}
                  defaultValue="All"
                  onChange={(e) => setSelectCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="">Office</option>
                  <option value="">Professional</option>
                  <option value="">Salaries</option>
                </select>
              </div>
              {/* start date */}
              <div>
                <label htmlFor="start-date" className={classNames.label}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  name="start-date"
                  className={classNames.selectInput}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {/* end date */}
              <div>
                <label htmlFor="end-date" className={classNames.label}>
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  name="end-date"
                  className={classNames.selectInput}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* pie chart */}
          <div className="flex-grow bg-white border-2 shadow rounded-lg p-4 md:p-6 dark:bg-slate-800">
           { (aggregatedData.length>0)? <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={aggregatedData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="amount"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {aggregatedData.map(
                    (entry: AggregatedDataItem, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === activeIndex
                            ? "rgb(29, 78, 216)"
                            : entry.color
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>:<div className="w-full h-full flex justify-center items-center">No Data Found</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
