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
    <div>
      <div className=" bg-pink-500 border-2 border-black px-10 pb-10 min-h-[40rem]">
        <div>
          {/* <div className="flex self-center justify-center">
            <h1 className=" text-[3rem] uppercase  p-2 border-2 border-black text-black mt-4  border-b-8 border-r-4 bg-yellow-500 font-bold px-10 ">
              Two Factor Token
            </h1>
          </div> */}
          <div className=" mt-10">
            <div className=" border-2 border-t-2 border-black mt-7"></div>
            <h3 className=" text-[1.5rem]  mt-4">
              Hello User, Thank you for Shopping with Us at PurchasePal. Your
              Order has been successfully Confirmed.
            </h3>
            <div className=" flex justify-between mt-7 ">
              <div>
                <h1 className=" text-[2rem] w-[48rem] uppercase  p-2 border-2 border-black text-black mt-4  border-b-8 border-r-4 bg-yellow-500 font-bold px-10 ">
                  Order Number: 66A0D7006396A12D9EA5A908
                </h1>
              </div>
              {/* order total */}
              <div className=" order Summary text-[1.2rem] mr-24">
                <div className=" mr-4">
                  <h1 className=" text-[2rem]"> Order Summary</h1>
                  <div className="">
                    <div className=" flex justify-between">
                      <div>Item(s) Subtotal </div>
                      <div className=" ">
                        :{formatPrice(orderData?.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                    <div className=" flex justify-between">
                      <h1>Shipping </h1>
                      <div className=" w-[6.5rem]">:{formatPrice(0)}</div>
                    </div>
                    <div className=" flex justify-between">
                      <h1>Discount </h1>
                      <div className=" w-[6.5rem]">:{formatPrice(0)}</div>
                    </div>
                    <div className=" flex justify-between">
                      <h1>Total</h1>
                      <div className=" ">
                        :{formatPrice(orderData?.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                    <div className=" flex justify-between font-bold">
                      <h1 className=" ">GrandTotal </h1>
                      <div className=" ">
                        :{formatPrice(orderData?.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" border-2 border-t-2 border-black mt-7"></div>
            {/* order items */}
            <div>
             {OrderItems?.map((orderItem) => {
               <div>
               <div className="  bg-yellow-500 mt-4">
                 <div className=" flex  text-[1.3rem] border-2 border-black border-b-8 border-r-4">
                   
                     <Image
                       src={orderItem?.product?.images[0].url}
                       height={200}
                       width={200}
                       fit="cover"
                       objectPosition="top"
                       alt=""
                       className=" h-[11rem] w-[10rem] object-cover  px-2 py-4  "
                     />
                   
                   <div className=" price py-4 w-full">
                     <h1 className=" py-2 px-2">
                       Product Name: {orderItem?.product?.name}
                     </h1>
                     <div className=" flex justify-between ">
                       <div className="w-[40rem]">
                         <h1 className=" py-2 px-2">
                           Brand Name :{orderItem?.product?.brand?.name}
                         </h1>

                         {orderItem?.color && (
                           <h1 className="py-2 px-2">
                             Colour: <ColorSpan color={orderItem?.color} />{" "}
                             {orderItem?.color}
                           </h1>
                         )}

                         {orderItem?.size && (
                           <h1 className=" py-2 px-2">
                             Size :{orderItem?.size}
                           </h1>
                         )}

                         <h1 className=" py-2 px-2">
                           Qty : <span>{orderItem?.quantity}</span>
                         </h1>
                         <h1 className="py-2 px-2">
                           Price:{" "}
                           <span className=" font-bold">
                             {orderItem?.price?.toLocaleString("en-IN", {
                               style: "currency",
                               currency: "INR",
                             })}{" "}
                             / Item
                           </span>
                         </h1>
                       </div>

                       

                       {/* */}
                     </div>
                   </div>
                 </div>

                 <div></div>
               </div>
             </div>
             })}
            </div>
            <div></div>
          </div>
          <div className=" mt-10">
            <h1 className=" text-[1.8rem]  font-bold"> Best Regards</h1>
            <h1 className=" text-[1.8rem]  font-bold"> Team PurchasePal</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
