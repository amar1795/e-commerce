

import { getCartDataFromCookies } from "@/actions/cart/addCartDatatoCookies";
import { getRelatedProducts } from "@/actions/cart/categoryRelatedProduct";
import deleteCartItem from "@/actions/cart/deleteCartProducts";
import { fetchAllCartCookieData } from "@/actions/cart/fetchAllCartCookieData";
import { createProduct, createProductRating, createProductReview, deleteProduct, fetchAllProduct, fetchAllReviews, fetchProduct, fetchProductAllData, fetchProductVarient, fetchProductanotherversion, fetchProductsByCategory, fethChildrenCategories, getProductsByCategory } from "@/actions/createProduct";
import { dummyUserFunction, getUserBySpecificEmail } from "@/actions/dummyUser";
import {  testEmail } from "@/actions/email/testEmail";
import { fetchAllOrders } from "@/actions/order/fetchAllOrder";
import { fetchOrderById } from "@/actions/order/fetchSingleOrder";
import { CreateBrand, CreateCategories, CreateColour, CreateSize, Createposter, UpdateCategory, createdummyPosterFunction, deleteSize, deleteduplicatebrandnames, dummyPosterFunction, fetchCategoriesWithPosters, fetchImagesByProductId, getAllColorsWithCount, getAllDummyPosters, getAllPosters, getAllSizes, getAllUsers, getBrand, getallCategory } from "@/actions/posterAction";
import { searchProductsByNameOrBrand } from "@/actions/product/findProductbySearch";
import { productCreationNew } from "@/actions/product/productCreation";
import { getUserById } from "@/auth";
import React from "react";
import WishlistButton from "@/components/animated_heart/heart"
import { generateCombinations, generatePantCombinations } from "@/actions/product/generateCombination";
import { createProductVarient, deleteProductVarients, GenerateCombinationProductVarients, updateProductVariantStock } from "@/actions/product/createProductVarients";
import emptyCart from "@/actions/cart/emptyCart";
import getUserWallet from "@/actions/payments/getUserWallet";
import deleteWallet from "@/actions/payments/deleteUserWallet";
import CreateUserWallet from "@/actions/payments/createUserWallet";
import { OrderConfirmationEmail } from "@/actions/email/Email";
const page = async() => {
  // CreateColour()
  // CreateSize()
  // getAllPosters()
  // Createposter()
  // fetchCategoriesWithPosters()
  // deleteSize()
  // getAllSizes()
  // getAllColorsWithCount()
  // getBrand()
  // CreateCategories()
  // dummyPosterFunction()
  // getAllDummyPosters()
  // getallCategory()
  // deleteduplicatebrandnames()
  // CreateBrand()
  // createProduct()
  // createProductVarient()
  // createProductRating()
  // getAllUsers()
  // createProductReview()
  
  // fetchProductAllData()
  // fetchAllReviews()
  // deleteProduct("665dbac4212a3a7b7d76b6c8")
  // fetchImagesByProductId("665db1c2212a3a7b7d76b660")
  // createdummyPosterFunction()
  // CreateCategories()
  // getallCategory()
  // productCreationNew()
  // UpdateCategory()
  // fetchAllProduct()
  // fetchProductAllData()
  // getProductsByCategory("665a0b9f14be77720636d443")
  // getUserBySpecificEmail("facfrenzy97@gmail.com")
  // deleteCartItem("6665de25b7e0328f68f43485","665af50e3220eba7c7eab944")
  //  const data= getRelatedProducts("6665de25b7e0328f68f43485").then((data)=>{console.log("this is the related products", data)})
  //  console.log("this is the related products", data);  
  // fetchAllOrders()
  // testEmail({last_name:"smith",first_name:"john"})
  // fetchOrderById("66756c6354363728fe808d27")
  // searchProductsByNameOrBrand("shirt")
  // getUserById("6673e3d87214902e3b734de3")
  // getCartDataFromCookies()
  // const { count } = await fetchAllCartCookieData();
  // const data=await getCartDataFromCookies()
  // const count=data.length;
  // console.log("this is the count", count);
  // generateCombinations("665b00173220eba7c7eabab3")
  // fetchProductAllData(["665ac95e5788e185779d7ce0"])
  // deleteProductVarients("665b05173220eba7c7eabadd")
  
  // fetchProductsByCategory("665a0ba214be77720636d44c")
  // fetchProduct("665af50e3220eba7c7eab944")
  
// const ProductsPants= [
  // { id: '665d68a9b76a9c2e856b5fbe' },
  // { id: '665d698ab76a9c2e856b5fc4' },
  // { id: '665d69d8b76a9c2e856b5fca' },
  // { id: '665d6a11b76a9c2e856b5fd0' }
// ]
// generatePantCombinations("665b028f3220eba7c7eabac5")
// createProductVarient("665b03223220eba7c7eabacb")
// GenerateCombinationProductVarients(ProductsPants)


// updateProductVariantStock("665af6f73220eba7c7eab949", 200)
// emptyCart()
  // const data=await getUserWallet()
  // console.log("this is the wallet data created", data?.wallet?.transactions);
  // this is the wallet data created [
  //   {
  //     id: '668f82acdfb64b86fd862474',
  //     walletId: '668f82acdfb64b86fd862473',
  //     amount: 100000,
  //     type: 'CREDIT',
  //     description: 'Initial deposit',
  //     createdAt: 2024-07-11T06:58:52.318Z,
  //     updatedAt: 2024-07-11T06:58:52.318Z
  //   }
  const orderItems = [
    { name: 'Product 1', quantity: 2, price: 19.99 },
    { name: 'Product 2', quantity: 1, price: 9.99 },
    { name: 'Product 3', quantity: 3, price: 5.99 }
  ];
  // OrderConfirmationEmail({first_name:"john",senders_email:"debine8588@modotso.com",orderNumber:"66756c6354363728fe808d27",orderItems:orderItems})
  // const orderId="66A0FED08CB7A73A01EE13EC";
  //  const orderData = await fetchOrderById(orderId);
        // setOrderData(orderData?.order);
        // setOrderItems(orderData?.order?.orderItems);
        // setDeliveryDate(getRandomFutureDate(orderData?.order?.createdAt));
        // console.log("this is the orderData ", orderData?.order?.orderItems[0]?.product?.images[0].url);
        // await OrderConfirmationEmail({first_name:"sadfsd",senders_email:"debine8588@modotso.com",orderNumber:orderId,orderItems:orderData?.order?.orderItems,orderData:orderData?.order})


  return (
    <div className=" bg-pink-500 border-2 border-black px-10 ">
      <div>
        <div className=" ">
          <h1 className=" text-[6rem] uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 font-bold">
          About Us
          </h1>
        </div>

        <div className=" mt-10">
          <div>
            {/* <WishlistButton /> */}
            <p className=" text-4xl">
              <strong>
                Welcome to Purchase Pal - Your Trusted Companion in Online
                Shopping!
              </strong>
            </p>
            <p className=" text-lg  mt-4">
              At Purchase Pal, we believe that shopping online should be an
              enjoyable and seamless experience. Founded with the vision to
              revolutionize the way people shop, we are committed to offering a
              platform that combines convenience, reliability, and a wide range
              of products to cater to all your needs.
            </p>

            <div className=" mt-5">
              <div className=" w-[20rem] ">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                 Our Mission
                </h2>
              </div>

              <p className=" text-lg  mt-4">
                Our mission is simple: to be your go-to partner in online
                shopping. We strive to provide an exceptional shopping
                experience by:
              </p>
              <ul>
                <li className=" text-lg  mt-4">
                  <strong>Offering a Diverse Range of Products:</strong> From
                  the latest electronics and stylish fashion pieces to essential
                  home goods and unique gifts, we bring a variety of products to
                  your fingertips. Our extensive catalog is curated to ensure
                  that you find exactly what you're looking for, and more.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Ensuring Quality and Authenticity:</strong> We partner
                  with trusted brands and suppliers to bring you only the best.
                  Every product on Purchase Pal is vetted for quality and
                  authenticity, so you can shop with confidence knowing you’re
                  getting genuine items.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Providing Outstanding Customer Service:</strong> Our
                  customer-centric approach means that your satisfaction is our
                  top priority. Our dedicated support team is always ready to
                  assist you with any queries or concerns, ensuring a smooth
                  shopping experience from start to finish.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Offering Competitive Prices:</strong> We understand
                  the importance of value for money. That's why we work
                  tirelessly to provide you with competitive prices without
                  compromising on quality.
                </li>
              </ul>
            </div>

            <div>
              <div className=" w-[20rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Our Vision
                </h2>
              </div>
              <p className=" text-lg  mt-4">
                We envision a world where shopping online is not just a
                necessity but a delight. A world where Purchase Pal is
                synonymous with trust, variety, and ease. We aim to continually
                innovate and improve our platform to meet and exceed your
                expectations, making every shopping journey with us memorable
                and rewarding.
              </p>

              <div className=" w-[34rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Why Choose Purchase Pal?
                </h2>
              </div>
              
              <ul className=" mt-4">
                <li className=" text-lg  mt-4">
                  <strong>User-Friendly Interface:</strong> Our intuitive
                  website design makes it easy for you to navigate and find what
                  you need quickly.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Secure Shopping Environment:</strong> Your security is
                  paramount to us. We employ advanced security measures to
                  protect your personal and financial information.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Fast and Reliable Delivery:</strong> We understand the
                  excitement of receiving your orders promptly. Our efficient
                  delivery network ensures your purchases reach you in the
                  shortest possible time.
                </li>
                <li className=" text-lg  mt-4">
                  <strong>Hassle-Free Returns:</strong> If something isn’t
                  right, our hassle-free return policy allows you to return
                  items easily and get a refund or exchange.
                </li>
              </ul>
            </div>

            <div>
            <div className=" w-[20rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Our Community 
                </h2>
              </div>
              <p className=" text-lg  mt-4">
                At Purchase Pal, we are more than just an ecommerce platform; we
                are a community. We value your feedback and actively engage with
                our customers to continually improve our services. Join us on
                social media to stay updated with the latest products,
                promotions, and exclusive offers. Your support and trust drive
                us to be better every day.
              </p>
            </div>
            <div className=" mb-10">
              <p className=" text-lg  mt-4 font-bold">
                Thank you for choosing Purchase Pal. Happy shopping!
              </p>

              <p className=" text-lg  mt-4 font-bold">
                <strong>With Gratitude,</strong>The Purchase Pal Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
