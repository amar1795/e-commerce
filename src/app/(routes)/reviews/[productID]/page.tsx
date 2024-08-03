"use client";

import {
  fetchProductAllData,
  getProductsByCategory,
} from "@/actions/createProduct";
import { fetchAllOrders } from "@/actions/order/fetchAllOrder";
import { findAllParentCategories } from "@/actions/product/searchedProductData";
import { fetchReview } from "@/actions/productRating/fetchReview";
import { getProductReviews } from "@/actions/productRating/getProductReview";
import { productDislike } from "@/actions/productReview/productDislike";
import { productLike } from "@/actions/productReview/productLike";
import { updatedDataResponse } from "@/app/categories/[categories]/[subcategories]/[product]/page";
import CustomButton from "@/components/CustomButton";
import CustomOrderSortButton from "@/components/CustomOrderSortButton";
import { ReviewModal } from "@/components/ReviewModal";
import LikeAndDislikeButton from "@/components/likeAndDislikeButton";
import OrderSummaryComponent from "@/components/order summary component/OrderSummaryComponent";
import { PaginationComponent } from "@/components/pagination";
import MiniStarRatingComponent from "@/components/rating star component/MiniStarRatingComponent";
import StarChart from "@/components/star charts/starChart";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DollarSign,
  IndianRupee,
  Star,
  StarIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { set } from "zod";


// Utility function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const page = ({ params }: { params: { productID: string } }) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [resetSort, setResetSort] = useState(false);
  const [filterRating, setFilterRating] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [data, setData] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [topmostParentCategory, setTopmostParentCategory] = useState("");
  const [verifiedPurchaseCount, setVerifiedPurchaseCount] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [newData, setNewData] = useState(true);
  const user = useCurrentUser();
  const [reviews, setReviews] = useState([]);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem("currentOrdersPage");
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  
// Function to remove spaces from a string
const removeSpaces = (name: string): string => {
  return name?.replace(/\s+/g, "");
};



  // Save current page to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentOrdersPage", currentPage.toString());
  }, [currentPage]);


  const { toast } = useToast();

  const callToast = ({ variant, title, description }) => {
    // alert("toast is being  called")
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  };

  const clearFilter = () => {
    // alert("clearFilter being called")
    setFilterRating(null);
    setResetFilter(true);
  }

  const clearSort = () => {
    // alert("clearSort being called")

    setSortOrder("desc");
  }
  
  const handlelike = async (ratingId: string) => {
    // alert("I am being called")
    const { error, message, like } = await productLike(ratingId);
    //  const likedData=like ? true : false
    //  setLike(likedData)
    //  callToast({title:`${message}` ,description :"You have succesfully liked the Comment"})
    // console.log("this is the liked data response", error, message, like);
  };

  const handleDislike = async (ratingId: string) => {
    // alert("I am being called")
    const { error, message, dislike } = await productDislike(ratingId);
    //  const dislikedData=dislike ? true : false
    //  setDislike(dislikedData)
    //  callToast({title:`${message}` ,description :"You have succesfully disliked the Comment",variant:"destructive"})

    // console.log("this is the disliked data response", error, message, dislike);
  };

  useEffect(() => {
    const updateData = async () => {
      // alert("I am being called")
      // this needs to be revalidated via polling every 30 minutes because if everyone starts rating it simulteneously it will hit the backend mulitple times
      const updatedData: updatedDataResponse | undefined =
        await fetchProductAllData(params.productID);
        // console.log("this is the category",updatedData?.category?.id)
      // console.log("this is the updatedData:", updatedData);
      setData(updatedData || null);
      // const relatedProducts = await getProductsByCategoryOriginal(updatedData?.category?.parentId)
      const relatedProducts = await getProductsByCategory(
        updatedData?.category?.id
      );

      setRelatedProducts(relatedProducts);
      setParentCategory(updatedData?.category?.parentName || "");
      // console.log("this is the parent category", updatedData?.category?.parentName);
      // alert("update Data is being called")
      // console.log("these are the related products:", relatedProducts);
      const {topmostParentCategory} = await findAllParentCategories(updatedData?.category?.id)
      setTopmostParentCategory(topmostParentCategory)
      // console.log("this is the parent categories",topmostParentCategory)
    };

    updateData();
  }, []);


  useEffect(() => {
    const fetchReviewData = async () => {
      const Data = await fetchReview({ productId: data?.id });
      // alert("fethcreviewdata is  been called")
      // console.log("this is the fetchreview data", Data);
      setReviewData(Data);
    };
    fetchReviewData();
  }, [data, newData]);

  useEffect(() => {
    const getReviews = async () => {
      if (data?.id ) {
        // alert(currentPage)
        const { reviews, verifiedPurchaseCount, totalPages } =
          await getProductReviews({
            productId: data?.id,
            fetchLimit: 10,
            page: currentPage,
            starRating: filterRating  || null,
            sortDirection: sortOrder as "asc" | "desc",
          });

        setTotalPages(totalPages);
        const value = reviews;
        setVerifiedPurchaseCount(verifiedPurchaseCount);
        setReviews(value);
        // console.log(
        //   `this is the reviews data for the product ID ${data?.id} ${verifiedPurchaseCount}`,
        //   reviews
        // );

        // console.log(
        //   `these are the reviews data `
        //  , reviews  );

        // setUpdateChart((prev) => !prev);
      }
    };
    getReviews();
  }, [data, newData, like, dislike, currentPage,sortOrder,filterRating]);

  const initialData = [
    {
      name: "5 Stars",
      uv: 5,
      stars: data?.ratings?.count[5],
      amt: 2000,
    },
    {
      name: "4 Stars",
      uv: 4,
      stars: data?.ratings?.count[4],
      amt: 2000,
    },
    {
      name: "3 Stars",
      uv: 3,
      stars: data?.ratings?.count[3],
      amt: 2000,
    },
    {
      name: "2 Stars",
      uv: 2,
      stars: data?.ratings?.count[2],
      amt: 2000,
    },
    {
      name: "1 Stars",
      uv: 1,
      stars: data?.ratings?.count[1],
      amt: 2000,
    },
  ];
  const [barChartData, setbarChartData] = useState(initialData);


  const url=`${process.env.MAIN_DOMAIN}/categories/${removeSpaces(topmostParentCategory)}/${removeSpaces(parentCategory)}/${data?.id}`
  // console.log("this is the unique colors",uniqueColors)


  return (
    <div>
      <div className=" min-h-[95vh] bg-teal-600 ">
        <div className=" flex justify-between  below-600:flex-col below-600:items-center   ">
          <div className=" " >
            <div className=" flex ml-20 below-600:items-center below-600:ml-0  below-600:mr-7  ">
            <div className=" h-[4rem]  ">
            <Link href={url}>
            <button
                      type="submit"
                      className=" px-5 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
                      onClick={clearSort}
                    >
                      <h1 className=" uppercase font-bold below-566:text-[0.8rem]">{"Back to Order  "} </h1>
                    </button>
                  </Link>
                  </div>

              {filterRating && (
                 <div className=" h-[4rem] ml-8">
                 <button
                   type="submit"
                   className=" px-5 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500 " 
                   onClick={clearFilter}
                 >
                   <h1 className=" font-bold">{"Clear Filter"} </h1>
                 </button>
               </div>
                )}

                {/* {
                  resetSort && (
                    <div className=" h-[4rem]">
                    <button
                      type="submit"
                      className=" px-5 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500"
                      onClick={clearSort}
                    >
                      <h1 className=" font-bold">{"Clear Sort"} </h1>
                    </button>
                  </div>

                  )
                  
                } */}
           
           
            </div>
          </div>
          <div className=" flex below-868:flex-col">

          {/* filter by rating */}
          <div className=" pr-11">
            <CustomOrderSortButton
            resetFilter={resetFilter}
            setResetFilter={setResetFilter}
            Rating={true}
              initialButtonName="FILTER BY RATING"
              initialOptions={[
                "5 Star Rating",
                "4 Star Rating",
                "3 Star Rating",
                "2 Star Rating",
                "1 Star Rating",
              ]}
              setFilterRating={setFilterRating}
            />
          </div>
          {/* sorting by latest ratings */}
          
          <div className=" pr-11">
            <CustomOrderSortButton
            resetSort={resetSort}
            setResetSort={setResetSort}
              initialButtonName="SORTBY"
              initialOptions={[
                "Newest",
                "Oldest",
              ]}
              setSortOrder={setSortOrder}
            />
          </div>
          </div>
        </div>
        <div className=" px-8">
          <div className=" border-black border-b-4 "></div>
        </div>

        <div className=" flex justify-between px-8 mt-4  below-1319:flex-col">
          <div className=" flex w-full ">
            <div className="flex  w-full   below-700:flex-col below-700:border-2 below-700:border-black">
              <div className="border-2  border-black below-700:border-none overflow-hidden below-700:flex below-700:items-center below-700:justify-center  ">
                <img
                  src={data?.images && data?.images[0]?.url}
                  alt=""
                  className=" h-[30rem] w-[22rem] object-cover below-700:h-[15rem] below-700:w-[15rem] "
                />
              </div>
              <div  className=" w-full ">
                <div>
                  <div className=" px-4">
                    <h1 className=" text-[4rem] font-bold below-500:text-[2rem] uppercase">
                      {data?.brand?.name}
                    </h1>
                    <h2 className=" text-[1.2rem] below-500:text-[0.8rem] uppercase">{data?.name}</h2>
                  </div>
                </div>

                <div>
                  <div className=" flex  mb-2 ml-4">
                    <h1 className=" self-center text-[2rem] below-500:text-[1.2rem] uppercase">MRP</h1>

                    <div className=" flex  self-center">
                      <div className=" self-center ">
                        <IndianRupee size={20} />
                      </div>
                      <h1
                        className=" text-[1.5rem] font-bold below-500:text-[1rem] uppercase"
                        style={{ textDecoration: "line-through" }}
                      >
                        {data?.price}
                      </h1>
                      <h1 className=" text-[1.5rem] font-bold ml-5 below-400:ml-1 below-500:text-[1rem] uppercase">
                        {data?.discountedPrice?.toFixed(2)}
                      </h1>
                      <h1 className=" text-[1.5rem] below-500:text-[1rem] below-400:ml-1 uppercase font-bold ml-5 text-yellow-400">
                        ({data?.discount}%OFF)
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" border-l-2 border-black below-700:border-2  below-835:items-center ">
            {/* ratings component */}
            <div className=" text-white  mb-14 flex flex-col below-835:items-center below-835:mt-[2rem] ">
              <div className=" flex  pl-8">
                <div>
                  <h1 className=" text-[3rem] below-500:text-[2rem] uppercase"> RATINGS </h1>
                </div>
                <div className=" px-5">
                  <Star
                    fill="yellow"
                    strokeWidth={0.5}
                    size={65}
                    stroke="black"
                  />
                </div>
              </div>

              <div className=" flex mt-6 ">
                <div className="left flex-1 border-r-2 border-gray-600 pl-8 pr-4 below-835:border-none ">
                  <div className="">
                    <div className="top flex mt-5 mb-2">
                      <p className=" text-[5rem] leading-none m-0 p-0 font-thin below-500:text-[3rem] uppercase ">
                        {data?.ratings?.averageRating.toFixed(1)}
                      </p>
                      <div className=" self-center ml-5">
                        <Star
                          fill="yellow"
                          size={38}
                          stroke="black"
                          strokeWidth={0.5}
                        />
                      </div>
                    </div>
                    <div className="Bottom below-500:text-[0.8rem] uppercase">
                      {verifiedPurchaseCount} Verified Buyers
                    </div>
                  </div>
                </div>
                <div className=" text-black w-[5rem] pl-5  flex flex-col justify-between below-835:hidden">
                  <div className=" flex w-5">
                    5{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="aqua" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    4{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="yellow" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    3{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="green" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    2{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="orange" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    1{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="red" size={15} />
                    </div>
                  </div>
                </div>

                <div className="right flex-1 pl-[14rem]  z-0 below-835:hidden">
                  <div className="  rotate-90 w-[5.5rem] h-[2rem] ">
                    <StarChart
                      barChartData={initialData}
                      initialCount={data?.ratings?.count}
                    />
                  </div>
                </div>
                <div className=" text-black w-[5rem]   flex flex-col justify-between below-835:hidden">
                  <p className=" flex w-5 pl-0">{data?.ratings?.count[5]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[4]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[3]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[2]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[1]} </p>
                </div>
              </div>
            </div>

            <div className=" ml-8">
              {/* review component */}
              <div>
                {reviewData?.review?.rating ? (
                  <div className="mr-11">
                    <div className=" flex ">
                      <p className="below-400:text-[0.8rem]">You Rated {reviewData?.review?.rating} Stars </p>
                      <div className=" self-center ml-2">
                        <MiniStarRatingComponent
                          reviewStars={reviewData?.review?.rating}
                        />
                      </div>
                    </div>

                    {reviewData?.review?.review === "" ? (
                      <ReviewModal
                        buttonColour={"bg-yellow-500"}
                        setNewData={setNewData}
                        buttonName="Add your Review"
                        reviewId={reviewData?.review?.id}
                        ProductName={data?.name}
                        ProductId={data?.id}
                        reviewStars={reviewData?.review?.rating}
                        reviewTitle={reviewData?.review?.reviewTitle}
                        reviewMessage={reviewData?.review?.review}
                        ProductImage={data?.images ? data?.images[0]?.url : ""}
                        isPaid={false}
                      />
                    ) : (
                      <div>
                        <p className="below-400:text-[0.8rem]">Your Review is :</p>
                        <p className="below-400:text-[0.8rem]">{reviewData?.review?.review}</p>
                        <div className="  below-445:flex below-445:items-center below-445:justify-center below-835:mb-2">

                       
                        <ReviewModal
                          buttonColour={"bg-yellow-500"}
                          setNewData={setNewData}
                          reviewId={reviewData?.review?.id}
                          buttonName="Edit your Review"
                          reviewStars={reviewData?.review?.rating}
                          reviewTitle={reviewData?.review?.reviewTitle}
                          reviewMessage={reviewData?.review?.review}
                          ProductName={data?.name}
                          ProductId={data?.id}
                          ProductImage={
                            data?.images ? data?.images[0]?.url : ""
                          }
                          isPaid={false}
                        />
                         </div>
                      </div>
                    )}
                  </div>
                ) : user ? (
                  <div className="mr-11">
                    <ReviewModal
                      buttonColour={"bg-yellow-500"}
                      setNewData={setNewData}
                      buttonName="Rate the product"
                      reviewId={reviewData?.review?.id}
                      ProductName={data?.name}
                      ProductId={data?.id}
                      ProductImage={data?.images ? data?.images[0]?.url : ""}
                      reviewStars={reviewData?.review?.rating}
                      reviewTitle={reviewData?.review?.reviewTitle}
                      reviewMessage={reviewData?.review?.review}
                      isPaid={false}
                    />
                  </div>
                ) : (
                  <div className=" h-[4rem]">
                    <button
                      type="submit"
                      className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
                      onClick={() =>
                        callToast({
                          variant: "destructive",
                          title: "Not Logged In",
                          description: "Please login to add the review",
                        })
                      }
                    >
                      <h1 className=" font-bold">{"Add review"} </h1>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" px-8 mt-4">
          <div className=" border-black border-b-4 "></div>
        </div>

        <div className=" flex below-835:items-center">
          <div className=" w-[30vw]  below-835:hidden"></div>

          <div className=" flex-1  ">
            <div className=" cxreviews   mb-4  px-4 pt-4">
              <div className="">
                <h1 className=" text-[1.2rem] font-semibold mb-4 below-400:text-[1rem]">
                  CUSTOMER REVIEWS({data?.ratings?.totalReviews})
                </h1>
                {/* review component */}
                {reviews?.length > 0 ? (
                  reviews
                    .filter((review) => review?.review !== null)
                    .map((review) => (
                      <div className=" flex border-2 border-black  bg-teal-600  min-h-28 mt-6">
                        <div className=" w-[3rem] border-r-2 border-black ">
                          <div className=" flex justify-between px-2 pt-1">
                            <div>{review?.rating}</div>
                            <div className=" self-center">
                              <StarIcon size={20} stroke="" fill="white" />
                            </div>
                          </div>
                        </div>
                        <div className="  w-full flex flex-col ">
                          {review?.reviewTitle && (
                            <p className=" below-400:text-[0.8rem]  h-auto px-2 py-2 border-b-2 border-black font-bold uppercase">
                              TITLE: {review?.reviewTitle}
                            </p>
                          )}

                          <p className=" below-400:text-[0.8rem] h-auto px-2 py-2 border-b-2 border-black">
                            {review?.review}
                          </p>

                          {review?.images && review?.images.length > 0 && (
                            <div className=" px-2 py-2 ImageComponent">
                              <Image
                                src=""
                                alt="test image"
                                width={100}
                                height={100}
                                className=" bg-green-600 mr-3"
                              />
                            </div>
                          )}

                          <div className="  h-[3rem] flex justify-between px-2 py-2  mt-5 below-566:flex-col below-566:h-full below-566:items-center">
                            <div className=" bg-white border-2 border-black flex self-center py-1 px-4 below-566:mb-2   ">
                              <p className="border-gray-500 border-r-2 pr-2 below-400:text-[0.8rem] ">
                                {review?.user?.name}
                              </p>

                              <p className=" pl-2 below-400:text-[0.8rem] ">
                                {formatDate(review?.createdAt)}{" "}
                              </p>
                            </div>
                            {review?.verifiedPurchase && (
                              <div className=" bg-white border-2 border-black flex self-center py-1 px-4    ">
                                <p className="border-gray-500  pr-2 below-400:text-[0.8rem] ">
                                  {"Verified "}
                                </p>
                              </div>
                            )}

                            {/* like and dislike buttons */}

                            <div>
                              <LikeAndDislikeButton
                              key={`${review?.id}-${currentPage}`} // Ensure re-render on page change
                                handlelike={handlelike}
                                handleDislike={handleDislike}
                                review={review}
                                callToast={callToast}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div>
                    <h1 className=" text-[1.2rem] font-semibold">
                      No reviews yet
                    </h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-[5rem] px-8 below-426:px-1  ">
          <div>
          <PaginationComponent
            currentOrderPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
