"use client";
import emptyCart from "@/actions/cart/emptyCart";
import { OrderConfirmationEmail } from "@/actions/email/Email";
import { fetchOrderById } from "@/actions/order/fetchSingleOrder";
import { updateOrderPaymentStatus } from "@/actions/order/orderUpdate";
import StepProgress from "@/components/StepProgress";
import CheckOutOrderSuccessCard from "@/components/checkout product card/checkoutOrderSuccessCard";
import CheckoutProductCard from "@/components/checkout product card/checkoutProductCard";
import { ConfettiComponent2 } from "@/components/confett2";
import { ConfettiComponent } from "@/components/confetti";
import OrderDetailsComponent from "@/components/order summary component/OrderDetailsComponent";
import SummaryCard from "@/components/summary product card/SummaryCard";
import TickAnimation from "@/components/tick animation/tickAnimation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CircleCheck, CircleCheckBig, DollarSign, X } from "lucide-react";
import React, { use, useEffect, useState } from "react";

// Utility function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getRandomFutureDate = (baseDateString) => {
  const baseDate = new Date(baseDateString);
  const randomDaysAhead = Math.floor(Math.random() * 3) + 2; // Generates a random number between 2 and 4
  baseDate.setDate(baseDate.getDate() + randomDaysAhead);

  const options = { day: "2-digit", month: "long", year: "numeric" };
  return baseDate.toLocaleDateString("en-GB", options);
};

const page = () => {
  const [orderData, setOrderData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState([]);

  // console.log("this is hte delviery Date ", deliveryDate);
  const user = useCurrentUser();

  useEffect(() => {
    const processOrder = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const successParam = queryParams.get("success");

      if (successParam) {
        const [success, orderId] = successParam.split("/orderId=");

        // Empty the cart if the success parameter is true
        if (success) {
          await emptyCart();
        }

        // Update the order payment status if the orderId parameter is present
        if (orderId) {
          await updateOrderPaymentStatus({ orderId: orderId });
          const orderData = await fetchOrderById(orderId);
          setOrderData(orderData?.order);
          setOrderItems(orderData?.order?.orderItems);
          setDeliveryDate(getRandomFutureDate(orderData?.order?.createdAt));

        await OrderConfirmationEmail({first_name:user?.name,senders_email:user?.email,orderNumber:orderId,orderItems:orderData?.order?.orderItems,orderData:orderData?.order})
          // console.log("this is the orderData ", orderData?.order);
        }
      } else {
        // this needs to be used in if block
        console.error("Missing success parameter");
        // const orderData = await fetchOrderById("666C0B82F6EF578CBE3C4965");
        // setOrderData(orderData?.order);
        // setOrderItems(orderData?.order?.orderItems);
        // setDeliveryDate(getRandomFutureDate(orderData?.order?.createdAt));
        // console.log("this is the orderData ", orderData?.order);
      }
    };

    processOrder();
  }, []);

  return (
    <div className=" overflow-hidden border-2 border-black">
      <div className=" flex ">
        <div>
          <ConfettiComponent />
          <ConfettiComponent2 />
        </div>
        <div className=" bg-teal-500 flex-1 border-2 border-black">
          <div className=" flex flex-col  justify-center ">
            <div className=" flex flex-col items-center ">
              {/* <CircleCheck size={140} strokeWidth={0.6} /> */}
              <div className=" ">
                <TickAnimation />
              </div>
              <h1 className=" text-2xl font-bold mt-4"> Thank you</h1>
              <h1 className=" text-4xl font-bold mt-2">
                {" "}
                Congractulations! Your Order has been Confirmed
              </h1>
              <h1 className=" text-[1.2rem] mt-4">
                {" "}
                Hey,{user?.name?.split(" ")[0]} We will send you an email
                Shortly to {user?.email} please check your email
              </h1>
            </div>
            <div className=" px-8 mt-8 ">
              <div className=" bg-white h-[15rem]">
                <div className=" px-8 py-5 ">
                  <div className=" w-full h-[8rem]  mt-8 ">
                    <StepProgress
                      orderedDate={formatDate(orderData?.createdAt)}
                    />
                  </div>

                  <div>
                    <span className="  text-gray-500">
                      {" "}
                      Expected delivery Date :
                    </span>
                    <span className=" font-bold mr-6">{deliveryDate}</span>
                    {/* <a
                      href="#"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      Track your Order
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" px-8 mt-8  pb-5">
            <div className=" border-b-2 border-black"></div>
            <div className="">
              <h1 className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 uppercase text-2xl bg-yellow-400 font-bold">
                Order Items({orderItems?.length})
              </h1>
            </div>
            <div className=" h-[30rem] overflow-y-auto">
              <div className=" flex flex-wrap   pt-4 pr-4">
                <div className=" py-1 mt-2 mb-2   w-full ">
                  {orderItems.map((item) => (
                    <div className=" mb-4">
                      <CheckOutOrderSuccessCard
                        // handleClickDelete={handleClickDelete}
                        product={item?.product}
                        quantity={item?.quantity}
                        // handleQuantityChange={handleQuantityCookieChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-pink-500 w-[30rem] border-2 border-black">
          <div className=" px-8">
            <div className=" h-[7rem] flex justify-between pt-4 border-b-2 border-black">
              <div className="">
                <h1 className=" text-2xl font-bold"> ORDER NUMBER</h1>
                <h1 className=" text-2xl font-bold uppercase">
                  #{orderData?.id}
                </h1>
              </div>
              <div></div>
            </div>
            <div className=" h-[4rem] ">
              <button className="w-auto  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-yellow-400">
                <h1 className=" font-bold">View or Manage orders</h1>
              </button>
            </div>
            <div>
              <div className=" h-[10rem] border-b-2 border-black">
                <h1 className="  h-[4rem] text-3xl font-bold mb-2 pt-3">
                  {" "}
                  Delivery Address
                </h1>

                {orderData.length !== 0 ? (
                  <>
                    {" "}
                    <h1>{`${orderData?.address?.apartment} , ${orderData?.address?.street}`}</h1>
                    <h1>{`${orderData?.address?.city},`}</h1>
                    <h1>{`${orderData?.address?.state} ${orderData?.address?.postalCode}, ${orderData?.address?.country}`}</h1>
                  </>
                ) : (
                  <>
                    <div>
                      <h1>Loading ...</h1>
                    </div>
                  </>
                )}

                {/* <h1> John Doe, 1234 Elm Street</h1>
                <h1> Apt 5B, Springfield,</h1>
                <h1> IL 62704, United States</h1> */}
              </div>
              <div className=" h-[10rem] border-b-2 border-black">
                <h1 className="  h-[4rem] text-3xl font-bold mb-2 pt-3">
                  Billing Address
                </h1>
                {orderData.length !== 0 ? (
                  <>
                    {" "}
                    <h1>{`${orderData?.address?.apartment} , ${orderData?.address?.street}`}</h1>
                    <h1>{`${orderData?.address?.city},`}</h1>
                    <h1>{`${orderData?.address?.state} ${orderData?.address?.postalCode}, ${orderData?.address?.country}`}</h1>
                  </>
                ) : (
                  <>
                    <div>
                      <h1>Loading ...</h1>
                    </div>
                  </>
                )}
              </div>
              <div className=" border-b-2 border-black  pb-6">
                <h1 className="  text-3xl font-bold mb-2 pt-3">
                  Payment Details
                </h1>
                <div className=" flex ">
                  <div className="  w-[15rem] ">
                    <h1 className="uppercase text-[1.2rem]">Payment Mode</h1>
                  </div>
                  <div className="">
                    <h1>{orderData?.paymentMode}</h1>
                  </div>
                </div>
                <div className=" flex ">
                  <div className="   w-[15rem]">
                    <h1 className="uppercase text-[1.2rem]">Payee Name </h1>
                  </div>
                  <div className=" ">
                    <h1>{orderData?.card?.cardHolderName}</h1>
                  </div>
                </div>
                <div className=" flex ">
                  <div className="   w-[15rem]">
                    <h1 className="uppercase text-[1.2rem]">Card Expiry </h1>
                  </div>
                  <div className=" ">
                    <h1>{orderData?.card?.cardExpiry}</h1>
                  </div>
                </div>
                <div className=" flex ">
                  <div className="   w-[15rem]">
                    <h1 className="uppercase text-[1.2rem]">Payment Status </h1>
                  </div>
                  <div className=" ">
                    <h1>{orderData?.isPaid == true && "SUCCESSFULL"}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className=" mb-5 mt-8">
                  <h1 className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 uppercase text-2xl  bg-yellow-400 font-bold">
                    {`${orderItems && `Order Summary(${orderItems?.length})`} `}
                  </h1>
                  <div className=" py-1 mt-2 mb-2 w-auto  ">
                    {orderItems.map((item) => (
                      <div className=" flex justify-between ">
                        <div className=" w-[25rem]">
                          <h1 className=" self-center  text-[1.2rem] font-bold">
                            {" "}
                            {item?.product?.name.length > 36
                              ? item?.product?.name.slice(0, 35) + "..."
                              : item?.product?.name}
                          </h1>
                        </div>
                        <span className=" flex  self-center  mr-4  w-[4rem]  justify-between">
                          <div className=" self-center">
                            <X />
                          </div>{" "}
                          <h1 className=" text-[1.5rem] ">{item?.quantity}</h1>
                        </span>

                        <div className=" flex self-center py-2  w-[10rem]">
                          <h1 className=" text-[1.3rem] self-center">
                            {(item?.price * item?.quantity)?.toLocaleString(
                              "en-IN",
                              {
                                style: "currency",
                                currency: "INR",
                              }
                            )}
                          </h1>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className=" border-b-2 border-black">
                    <div className=" flex justify-between">
                      <span className=" self-center  text-2xl font-bold">
                        Sub Total
                      </span>
                      <span className="text-[1.3rem]">
                        {orderData?.orderTotal?.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                    <div className=" flex justify-between">
                      <span className=" self-center  text-2xl font-bold">
                        Delivery
                      </span>
                      <span>
                        <div className=" flex  ">
                          <h1 className=" text-[1.3rem] self-center">0</h1>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className=" flex justify-between">
                    <span className=" self-center text-2xl font-bold">
                      {" "}
                      Total
                    </span>
                    <span>
                      <div className=" flex  ">
                        <h1 className="text-[1.3rem]">
                          {orderData?.orderTotal?.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </h1>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
