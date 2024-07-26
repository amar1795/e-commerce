import ColorSpan from "@/components/ColourSpan";
import OrderDetailsComponent from "@/components/order summary component/OrderDetailsComponent";
import Image from "next/image";
import React from "react";

const page = () => {
  const formatPrice = (price: number): string => {
    // Format the price with the Indian Rupee symbol
    return "₹" + price?.toLocaleString("en-IN");
  };

  const orderData = {};
  const orderItem = {};
  const OrderItems = orderData?.order?.orderItems;
  return (
    <div className=" h-screen">
     <h1 className=" p-2 border-2 border-black text-black flex  justify-center border-b-4 border-r-4  bg-pink-500 font-bold w-6 h-6  text-center  items-center  ">
              P
            </h1>
    </div>
  );
};

export default page;
