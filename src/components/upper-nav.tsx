// "use client";
import { Button } from "@/components/ui/button";
import Dropdown from "./Dropdown";
import CategoriesDropdown from "./Categories-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import ShoppingCart from "./shopping-cart";
import WishingListIcon from "./wishing-list-icon";
import { Heart, HomeIcon, Moon, MoonIcon, SunIcon } from "lucide-react";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomThemeToggle from "./DarkModeButton/CustomThemeToggle";
import { useTheme } from "next-themes";
import userCustomButton from "./userCustomButton";
import UserCustomButton from "./userCustomButton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";

const Uppernav = ({ mensCollectionData, cartCountData }) => {
  const completeUrl = typeof window !== "undefined" ? window.location.href : "";
  const segments = completeUrl.split("/");
  const previousSegment = segments[segments.length - 2];
  const previousSegment1 = segments[segments.length - 3];
  const user = useCurrentUser();
  // console.log("this is the user", user);
  // console.log("this is the mens collection data", mensCollectionData);
  return (
    <div className=" flex justify-center items-center mt-7 w-full h-10 px-[1.9rem] z-50 ">
      {/* desktop view */}
      <div className="w-full h-[9rem] bg-white bg-opacity-[80px] backdrop-blur-lg border border-white/30 flex justify-center items-center below-1319:hidden ">
        <div className=" mr-5 ">
          <CustomButton
            initialButtonName="ALL"
            initialOptions={["Mens", "Womens", "Kids"]}
          />
        </div>

        <div className=" mr-5">
          <CustomInput />
        </div>

        <Link href="/">
          <div className=" mr-4">
            <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500">
              <HomeIcon size={25} />
            </button>
          </div>
        </Link>

        <div className="mx-2 ">
          {user ? (
            <UserCustomButton
              buttonName={user ? `Hello ${user.name.split(" ")[0]}` : "Sign In"}
            />
          ) : (
            <div className="  h-[4rem]">
              <Link href="/login">
                <button className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                  <h1 className="font-bold">Sign in</h1>
                </button>
              </Link>
            </div>
          )}
        </div>

        <Link href="/cart">
          <div className="">
            <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
              <ShoppingCart
                mensCollectionData={mensCollectionData}
                cartCountData={cartCountData}
              />
            </button>
          </div>
        </Link>

        {user && (
          <Link href="/wishlist">
            <div className=" ml-2">
              <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                <WishingListIcon mensCollectionData={mensCollectionData} />
              </button>
            </div>
          </Link>
        )}

        <div className=" px-2">
          <CustomThemeToggle />
        </div>
      </div>

      {/* tablet view */}
      <div className="w-full h-[9rem] bg-white bg-opacity-[80px] backdrop-blur-lg    items-center hidden below-1319:flex below-1319:flex-col below-1319:pt-[4rem]   below-1319:h-[12rem] below-600:hidden">
        <div className=" flex ">
          <div className=" mr-5">
            <CustomInput />
          </div>

          <Link href="/">
            <div className=" mr-4">
              <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500">
                <HomeIcon size={25} />
              </button>
            </div>
          </Link>
        </div>

        <div className=" flex items-center ">
          <div className=" mr-5">
            <CustomButton
              initialButtonName="ALL"
              initialOptions={["Mens", "Womens", "Kids"]}
            />
          </div>
          <div className="mx-2 ">
            {user ? (
              <UserCustomButton
                buttonName={
                  user ? `Hello ${user.name.split(" ")[0]}` : "Sign In"
                }
              />
            ) : (
              <div className="  h-[4rem]">
                <Link href="/login">
                  <button className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                    <h1 className="font-bold">Sign in</h1>
                  </button>
                </Link>
              </div>
            )}
          </div>

          <Link href="/cart">
            <div className="">
              <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                <ShoppingCart
                  mensCollectionData={mensCollectionData}
                  cartCountData={cartCountData}
                />
              </button>
            </div>
          </Link>

          {user && (
            <Link href="/wishlist">
              <div className=" ml-2">
                <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                  <WishingListIcon mensCollectionData={mensCollectionData} />
                </button>
              </div>
            </Link>
          )}

          <div className=" px-2">
            <CustomThemeToggle />
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div className="w-full h-[9rem]  bg-white bg-opacity-[80px] backdrop-blur-lg    items-center hidden below-600:flex below-600:flex-col below-600:h-[12rem] below-600:mt-[10rem] below-426:">
        <div className=" flex  ">
          <div className=" mr-5">
            <CustomInput />
          </div>

          <Link href="/">
            <div className=" mr-4">
              <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500">
                <HomeIcon  className=" below-400:w-4 below-400:h-4 w-7 h-7" />
              </button>
            </div>
          </Link>
        </div>

        <div className=" flex items-center  flex-col   ">
          <div className=" flex">
            <div className=" mr-5">
              <CustomButton
                initialButtonName="ALL"
                initialOptions={["Mens", "Womens", "Kids"]}
              />
            </div>
            <div className="mx-2 ">
              {user ? (
                <UserCustomButton
                  buttonName={
                    user ? `Hello ${user.name.split(" ")[0]}` : "Sign In"
                  }
                />
              ) : (
                <div className="  h-[4rem]">
                  <Link href="/login">
                    <button className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                      <h1 className="font-bold">Sign in</h1>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className=" flex">
            <Link href="/cart">
              <div className="">
                <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                  <ShoppingCart
                    mensCollectionData={mensCollectionData}
                    cartCountData={cartCountData}
                  />
                </button>
              </div>
            </Link>

            {user && (
              <Link href="/wishlist">
                <div className=" ml-2">
                  <button className=" p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
                    <WishingListIcon mensCollectionData={mensCollectionData} />
                  </button>
                </div>
              </Link>
            )}

            <div className=" px-2">
              <CustomThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uppernav;
