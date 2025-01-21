import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex-1 bg-[#d1d1d1]">
      <Outlet />
    </div>
  );
};

export default MainLayout;
