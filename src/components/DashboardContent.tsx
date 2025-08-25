import React from "react";
import Sidebar from "./LayoutSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-blue-50 p-6 overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardContent;
