import Link from "next/link";
import React from "react";
import OrderDetailsComponent from "./OrderDetailsComponent";

interface Address {
  id: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  firstName: string;
  lastName: string;
  apartment: string;
  phoneNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Card {
  id: string;
  userId: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolderName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  isPaid: boolean;
  deliveryStatus: string;
  orderTotal: number;
  userId: string;
  addressId: string;
  cardId: string;
  walletId: string | null;
  paymentMode: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: any;
  address: Address;
  card: Card;
  wallet: any | null; // Define the actual type if known
}

// interface OrderItem {
//   productName: string;
//   productCompanyName: string;
//   productQuantity: number;
// }

// need to fix the bug for the related items used inthe shooping cart the link url is showing undefined
const formatPrice = (price: number): string => {
  // Format the price with the Indian Rupee symbol
  return "₹" + price?.toLocaleString("en-IN");
};


interface OrderProps {
  orderPlacedDate: string;
  orderTotalAmount: number;
  orderShippersName: string;
  orderNumber: string;
  orderItems: OrderItem[];
  order: Order;
  isPaid: boolean;
}

const OrderSummaryComponent: React.FC<OrderProps> = ({
  orderPlacedDate,
  orderTotalAmount,
  orderShippersName,
  orderNumber,
  orderItems,
  order,
  isPaid,
}) => {
  // Assuming order.createdAt is a string representing a valid date in ISO 8601 format
  const createdAtDate = new Date(order.createdAt);
  // this is Paid is true
// console.log("this is the order from order SUmmary containg isPaid Data",order.isPaid);
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
  // Constructing the final formatted date string
  // const finalFormattedDate = `${day} ${month} ${year}`;

  return (
    <div>
      
      
      <div className="mt-14 pt-2">
      <div className=" mx-24 pb-5 h-[4rem]">
        
          <button
            type="submit"
            className=" p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-teal-600"
          >
            <h1 className=" font-bold text-[2rem]">ORDER#{order.id.toUpperCase()} </h1>
          </button>
        
      </div>
      
      <div className="  border-2 border-black mx-24 pt-4 pb-5 bg-teal-600">
        
        <div className=" bg-yellow-500 text-black pb-5 flex justify-between px-9 mx-2 border-2 border-black border-b-8 border-r-4  ">
          <div>
            <div className=" flex justify-between h-full text-[1.3rem] w-[30rem] pt-5 ">
              <div className=" min-w-[10rem]">
                <h1 className=" font-bold underline">ORDER PLACED </h1>
                <p>{formattedDate}</p>
                <p>{formattedTime}</p>
              </div>
              <div className="min-w-40">
                <h1 className=" font-bold underline"> TOTAL AMOUNT</h1>
                <p>{formatPrice(order.orderTotal)}</p>
              </div>
              <div className="min-w-[12rem]">
                <h1 className=" font-bold underline">SHIPPING ADDRESS</h1>
                <p>Street: {order.address.street}</p>
                <p>Apartment: {order.address.apartment}</p>
                <p>City: {order.address.city}</p>
                <p>State: {order.address.state}</p>
                {/* <p>Landmark: {order.address.landmark}</p>
                <p>Postal Code: {order.address.postalCode}</p>
                <p>Country: {order.address.country}</p>
                <p>Phone Number: {order.address.phoneNumber}</p> */}
              </div>
              <div className=" flex flex-col justify-between">
              <div className=" ml-7 min-w-[10rem]">
                <h1 className=" font-bold underline">Paid Status</h1>
                <p>{order.isPaid ? "Paid" : "Unpaid"}</p>
              </div>
              <div className=" ml-2 min-w-[15rem]">
                <h1 className=" font-bold underline">Delivery Status</h1>
                <p>
                  {!order.isPaid ? "Order Not Confirmed" : order.deliveryStatus =="ORDER_PLACED" ? "Order Confirmed":""}
                 </p>
              </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col  h-full text-[1.3rem] w-[20rem] pt-5">
            <h1 className=" font-bold"> ORDER#{order.id.toUpperCase()}</h1>
            <button>
              <Link href={`/orders/${order.id}`}><button className="w-auto p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-teal-600">
            <h1 className=" font-bold">View Order Details </h1>
          </button></Link>
            </button>
          </div>
        </div>
        <div className=" mx-2 mt-4 ">
          <div>
            {order.orderItems.map((orderItem, index) => (
              <OrderDetailsComponent key={index} orderItem={orderItem}  isPaid={order.isPaid} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrderSummaryComponent;
