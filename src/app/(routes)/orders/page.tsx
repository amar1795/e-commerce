"use client"

import { fetchAllOrders } from "@/actions/order/fetchAllOrder";
import CustomButton from "@/components/CustomButton";
import CustomOrderSortButton from "@/components/CustomOrderSortButton";
import LoadingAnimation from "@/components/Loading/LoadingAnimation";
import OrderSummaryComponent from "@/components/order summary component/OrderSummaryComponent";
import { PaginationComponent } from "@/components/pagination";
import React, { use, useEffect, useState } from "react";

const page =  () => {

  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem("currentOrdersPage");
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  
  const [sortOrder, setSortOrder] = useState("desc");
     // Save current page to local storage whenever it changes
     useEffect(() => {
      localStorage.setItem("currentOrdersPage", currentPage.toString());
    }, [currentPage]);

  useEffect(() => {
    setOrderLoading(true);
    const fetchOrders = async () => {
     const  fetchedOrders = await fetchAllOrders({page:currentPage,sortOrder});
      setOrders(fetchedOrders);
      // console.log("these are the fetched orders",fetchedOrders);
      setOrderLoading(false);
     
    };
    fetchOrders();

  }
  , [currentPage,sortOrder])



  // console.log("these are the orders",orders);
  // orders.forEach((order) => {
  //   console.log(`Order ID: ${order.id}`);
  //   console.log(`Order Total: ${order.orderTotal}`);
  //   console.log(`Delivery Status: ${order.deliveryStatus}`);
  //   console.log(`Is Paid: ${order.isPaid}`);

  //   console.log("Order Items:");
  //   order.orderItems.forEach((orderItem) => {
  //     console.log(`- Order Item ID: ${orderItem.id}`);
  //     console.log(`  Product Name: ${orderItem.product?.name}`);
  //     console.log(`  Product Image: ${orderItem.product.images[0].url}`);
  //     console.log(`  Quantity: ${orderItem.quantity}`);
  //     console.log(`  Price: ${orderItem.price}`);
  //     // Add more properties as needed
  //   });
  // });

  return (
    <div className=" ">
      <div className="  bg-pink-500   w-full ">
        <div className=" flex justify-between below-730:flex-col below-730:items-center">
      
        <div className="">
        <h1 className=" text-[4rem] pl-10 uppercase below-925:text-[2rem] below-445:text-[1.5rem] below-445:pl-2 below-445:mt-4">Your Total Orders : {orders[0]?.totalOrdersCount}</h1>
        </div>
        <div className=" pr-11">
       
          <CustomOrderSortButton
                initialButtonName="SORTBY"
                initialOptions={["New to Old", "Old to New"]}
                setSortOrder={setSortOrder}
              />
        </div>
        </div>
        <div className=" px-8">
          <div className=" border-black border-b-4 ">
          
          </div>
        </div>
        <div className="">
          <div className="  pt-5 pb-5 ">
         {
          orderLoading ? ( <div className=" h-screen flex items-center justify-center">
            <LoadingAnimation />
          </div>):(
            (orders == null || orders.length === 0)
      ?(<h1 className=" text-[2rem] uppercase ml-8">No orders Placed yet</h1>)
      :(orders.map((order) => (
        <OrderSummaryComponent
          
          order={order}
          key={order.id}
        />
      )))
          )
    
    
    
  }
         
          </div>
        </div>
        <div className="flex justify-end mt-[5rem] px-8">
  <div>
    <PaginationComponent 
      currentOrderPage={currentPage}
      totalPages={orders[0]?.totalPages}
      onPageChange={(page) => setCurrentPage(page)}
    />
  </div>
</div>
      </div>
    </div>
  );
};

export default page;
