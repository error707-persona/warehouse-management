"use client";
import React from "react";
import CartPopularProducts from "./CartPopularProducts";
import CardSalesSummary from "./CardSalesSummary";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardExpenseSummary from "./CardExpenseSummary";
import StateCard from "./StateCard";
import { CheckCircle, Package, Tag, TrendingDown, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-4 custom-grid-rows ">
      <CartPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <StateCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-bue-600 w-6 h-6" />}
        dateRange="22 m- 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StateCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-bue-600 w-6 h-6" />}
        dateRange="22 m- 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StateCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-bue-600 w-6 h-6" />}
        dateRange="22 m- 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: "1000.00",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "200.00",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
