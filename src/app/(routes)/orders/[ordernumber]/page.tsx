import { fetchOrderById } from "@/actions/order/fetchSingleOrder";
import OrderDetailsComponent from "@/components/order summary component/OrderDetailsComponent";
import OrderSummaryComponent from "@/components/order summary component/OrderSummaryComponent";
import { PaginationComponent } from "@/components/pagination";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: { ordernumber: string } }) => {
  // console.log("this is the order number",params.ordernumber);
  const orderData = await fetchOrderById(params.ordernumber);
  // console.log("this is the order rating data for single order", orderData.order?.orderItems[0].product.ratings);

  const createdAtDate = new Date(orderData.order.createdAt);

  // Extracting day, month, and year from the date object
  const day = createdAtDate.getDate();
  const month = createdAtDate
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase(); // Convert month to uppercase
  const year = createdAtDate.getFullYear();

  // Extracting hours and minutes
  const hours = createdAtDate.getHours().toString().padStart(2, "0");
  const minutes = createdAtDate.getMinutes().toString().padStart(2, "0");

  // Constructing the final formatted date and time string
  const formattedDate = `${day} ${month} ${year}`;
  const formattedTime = `${hours}:${minutes}`;

   const formatPrice = (price: number): string => {
    // Format the price with the Indian Rupee symbol
    return "₹" + price?.toLocaleString("en-IN");
  };
  return (
    <div>
      <div className=" min-h-[95vh] bg-pink-500 ">
        <h1 className=" text-[4rem] pl-10 uppercase below-445:text-[2rem]">Your Orders</h1>
        <div className=" text-[1.3rem] flex px-8 mb-5 justify-between below-1000:flex-col">
          <h1 className=" mr-11 uppercase below-445:text-[1rem] below-445:mr-0">
            Ordered on : {formattedDate} at {formattedTime}
          </h1>
          <h1 className="uppercase below-445:text-[1rem]">Order Number : #{params.ordernumber}</h1>
          <div className=" below-445:mt-5">
          <div className=" h-[4rem] uppercase">
                      <Link href="/orders">
                      <button
                        type="submit"
                        className="w-80  p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-teal-600 below-566:w-[12rem] below-566:text-[1rem] uppercase "
                      >
                        <h1 className=" font-bold">Back to Orders </h1>
                      </button>
                        </Link>
                    </div>
          </div>
        </div>
      
        <div className=" px-8">
          <div className=" border-black border-b-4 "></div>
        </div>
        <div className="mx-11">
          <div className=" mt-8 pt-2  pb-5">
            <div className=" bg-yellow-500 text-black below-1265:flex-col flex justify-between px-9 mx-2 border-2 border-black border-b-8 border-r-4 text-[1.3rem] ">
              <div>
                <div className=" flex  pt-4 pb-4  justify-between below-600:flex-col ">
                  <div className=" shippping address ">
                    <h1 className="font-bold below-445:text-[1.2rem] ">SHIPPING ADDRESS</h1>

                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem] ">Street: {orderData.order.address.street}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Apartment: {orderData.order.address.apartment}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">City: {orderData.order.address.city}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">State: {orderData.order.address.state}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Landmark: {orderData.order.address.landmark}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Postal Code: {orderData.order.address.postalCode}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Country: {orderData.order.address.country}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Phone Number: {orderData.order.address.phoneNumber}</p>
                  </div>
                  <div className=" Billing address ml-6 below-600:ml-0">
                    <h1 className="font-bold below-445:text-[1.2rem]">BILLING ADDRESS</h1>

                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Street: {orderData.order.address.street}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Apartment: {orderData.order.address.apartment}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">City: {orderData.order.address.city}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">State: {orderData.order.address.state}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Landmark: {orderData.order.address.landmark}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Postal Code: {orderData.order.address.postalCode}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Country: {orderData.order.address.country}</p>
                    <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Phone Number: {orderData.order.address.phoneNumber}</p>
                  </div>

                  <div className=" w-[20rem]  pl-12  below-600:pl-0 ">
                    <h1 className="font-bold below-445:text-[1.2rem]">PAYMENT METHOD</h1>

                    {orderData.order?.card != null ? (
                      <>
                        <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">CREDIT CARD</p>
                        <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">CARD HOLDER NAME</p>
                        <p className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">{orderData.order?.card.cardHolderName}</p>
                      </>
                    ) : (
                      <p className="below-695:text-[1rem] below-445:text-[0.8rem]">ONLINE</p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" order Summary">
                <div className=" mr-4">
                  <h1 className=" text-[2rem] uppercase below-445:text-[1.2rem]"> Order Summary</h1>
                  <div className="">
                    <div className=" flex justify-between">
                      <div className=" uppercase below-695:text-[1rem]  below-445:text-[0.8rem] below-445:w-[5rem]">Item(s) Subtotal </div>
                      <div className="below-695:text-[1rem]  below-445:text-[0.8rem] ">
                        :{formatPrice(orderData.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                    <div className=" flex justify-between">
                      <h1 className="  below-445:w-[10rem] uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Shipping </h1>
                      <div className=" w-[6.5rem] below-695:text-[1rem] below-445:text-[0.8rem]">:{formatPrice(0)}</div>
                    </div>
                    <div className=" flex justify-between">
                      <h1 className="  below-445:w-[10rem] uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Discount </h1>
                      <div className=" w-[6.5rem] below-695:text-[1rem] below-445:text-[0.8rem]">:{formatPrice(0)}</div>
                    </div>
                    <div className=" flex justify-between">
                      <h1 className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">Total</h1>
                      <div className="below-695:text-[1rem] below-445:text-[0.8rem] ">
                        :{formatPrice(orderData.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                    <div className=" flex justify-between font-bold">
                      <h1 className=" uppercase below-695:text-[1rem] below-445:text-[0.8rem]">GrandTotal </h1>
                      <div className="below-695:text-[1rem] below-445:text-[0.8rem] ">
                        :{formatPrice(orderData.order?.orderTotal.toFixed(2))}
                      </div>
                    </div>
                  </div>
                  <div className=" mt-8">
                    <div className=" h-[4rem]">
                      <button
                        type="submit"
                        className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-teal-600 below-566:w-[12rem] below-566:text-[1rem]"
                      >
                        <h1 className=" font-bold uppercase">Download Invoice </h1>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" px-2 ">
              {
                <div>
                  {orderData.order?.orderItems.map((order) => {
                    return (
                      <OrderDetailsComponent
                        key={order.id}
                        orderItem={order}
                        // orderData={orderData}
                      />
                    );
                  })}
                </div>
              }
            </div>
            <div className="px-8  mt-[5rem] ml-[50rem]">
              {/* <PaginationComponent /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
