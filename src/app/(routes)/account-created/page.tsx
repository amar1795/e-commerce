import React from "react";

const page = () => {
  return (
    <div>
      <div className=" bg-pink-500 border-2 border-black px-10 pb-10 min-h-[40rem]">
        <div>
          <div className="flex self-center justify-center">
            <h1 className=" text-[3rem] uppercase  p-2 border-2 border-black text-black mt-4  border-b-8 border-r-4 bg-yellow-500 font-bold px-10 ">
              Two Factor Token
            </h1>
          </div>
          <div className=" mt-10">
            <h3 className=" text-[1.5rem]  ">
            Hello , Please use the following token to verify your account
            </h3>
            <h1 className=" text-[2rem] w-[12rem] uppercase  p-2 border-2 border-black text-black mt-4  border-b-8 border-r-4 bg-yellow-500 font-bold px-10 ">
              123456
            </h1>
          </div>
          <div className=" mt-10">
          <h1 className=" text-[1.8rem]  font-bold" > Best Regards</h1>
          <h1 className=" text-[1.8rem]  font-bold" > Team PurchasePal</h1>
          </div>
        </div>


      </div>
    </div>
  );
};

export default page;
