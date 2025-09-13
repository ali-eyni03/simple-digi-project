import { Outlet } from "react-router-dom";
import SellerProfileMenu from "./SellerProfileMenu.jsx";
import SellerProfileNavbar from "./components/SellerProfileNavbar.jsx";
import { useState } from "react";

const SellerProfileLayout = () => {
  
  return (
    <div className="pb-8 min-h-screen flex flex-col bg-gray-50 w-full">
      <SellerProfileNavbar />
      <div className="container flex w-[97%] m-auto relative">
        <div className="absolute lg:static menuContainer flex flex-col ">
          <SellerProfileMenu />
        </div>
        <div className="contentContainer w-full mt-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerProfileLayout;
