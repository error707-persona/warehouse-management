

import DashboardWrapper from "../dashboardWrapper";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard pages",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
