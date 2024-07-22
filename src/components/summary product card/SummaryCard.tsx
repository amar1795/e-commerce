import { DollarSign, Heart, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

const SummaryCard = () => {
  return (
    <div>
      <div className=" border-2 border-black  rounded-xl overflow-hidden">
        <div className=" overflow-hidden flex justify-between bg-opacity-20 backdrop-blur-lg border border-white/30 bg-white ">
          <div className=" flex">
            <img
              src="https://images.pexels.com/photos/23541799/pexels-photo-23541799/free-photo-of-shine-bright.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                            'https://images.pexels.com/photos/17395579/pexels-photo-17395579/free-photo-of-shiny-water-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className=" h-[11rem] w-[10rem] object-cover  px-2 py-4 "
            />
            <div className=" price py-4">
              <h1 className=" px-2">Product Name</h1>
              <h1 className=" px-2">Company Name</h1>
              <h1 className=" px-2 text-gray-300">Color <span className=" text-black"> green</span></h1>
              <h1 className=" px-2 text-gray-300">Size<span className=" text-black"> Large</span></h1>
              <h1 className=" px-2 text-gray-300">Qty<span className=" text-black"> 4</span></h1>

              
            </div>
          </div>
          <div className="  w-[6rem] px-2 pt-7 h-[5rem]  mr-5">
            <div className="">
              <div className=" flex self-center py-2">
                <div className=" self-center">
                  <DollarSign size={20} />
                </div>
                <h1 className=" text-[1.3rem] self-center">9.99</h1>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
