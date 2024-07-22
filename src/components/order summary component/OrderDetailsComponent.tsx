"use client";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { ReviewModal } from "../ReviewModal";
import Link from "next/link";
import { fetchReview } from "@/actions/productRating/fetchReview";
import MiniStarComponent from "../rating star component/MiniStarComponent";
import MiniStarRatingComponent from "../rating star component/MiniStarRatingComponent";
import ColorSpan from "../ColourSpan";
import { getProductDetailsByID } from "@/actions/product/searchedProductData";

// helper function to format the parent Categories to be used in the link
const extractFirstAndLastParentCategoryNamesWithNumbers = (
  parentCategories
) => {
  if (!parentCategories || parentCategories.length === 0) return [];

  const formattedCategories = [];
  if (parentCategories[0]) {
    formattedCategories.push(`${parentCategories[0].name.replace(/\s+/g, "")}`);
  }
  if (
    parentCategories.length > 1 &&
    parentCategories[parentCategories.length - 1]
  ) {
    formattedCategories.push(
      `${parentCategories[parentCategories.length - 1].name.replace(
        /\s+/g,
        ""
      )}`
    );
  }

  return formattedCategories;
};

const OrderDetailsComponent = ({ orderItem, isPaid }) => {
  const [reviewData, setReviewData] = useState(null);
  const [newData, setNewData] = useState(true);
  const [url, setUrl] = useState("");

  console.log("this is the review Data", reviewData);
  // console.log("this is the review rating", reviewData?.review?.rating);
  // console.log("this is the review reviewTitle", reviewData?.review?.review);
  // console.log(
  //   "this is the review reviewMessage",
  //   reviewData?.review?.reviewTitle
  // );
  // console.log("this is the product ID and the name", orderItem?.product.id, orderItem?.product.name)
  console.log("this is the product ID inside the orderItem", orderItem)
  useEffect(() => {
    const fetchReviewData = async () => {
      const Data = await fetchReview({ productId: orderItem?.productId });
      setReviewData(Data);
      const data = await getProductDetailsByID(orderItem?.productId);

      if (data) {
        let { parentCategory, topmostParentCategory } = data?.parentCategoryIds;

        const productId = data?.productId || "";
        if (parentCategory === "Kids Category") {
          parentCategory = "Kids";
        }

        const cleanedCategory0 = parentCategory.replace(/\s+/g, "");
        const testUrl = `/categories/${topmostParentCategory}/${cleanedCategory0}/${productId}`;
        console.log("this is the test url", testUrl);
        setUrl(testUrl);
      }
    };
    fetchReviewData();
  }, [newData]);

  // console.log("this is the order item", orderItem);
  // calling the helper function
  const parentCategoryNamesWithNumbers =
    extractFirstAndLastParentCategoryNamesWithNumbers(
      orderItem?.product?.parentCategories
    );

  // console.log("these are the parent categories", parentCategoryNamesWithNumbers)

  return (
    <div>
      <div className="  bg-yellow-500 mt-4">
        <div className=" flex  text-[1.3rem] border-2 border-black border-b-8 border-r-4">
          <Link
            href={url}
          >
            <Image
              src={orderItem?.product.images[0].url}
              height={200}
              width={200}
              fit="cover"
              objectPosition="top"
              alt=""
              className=" h-[11rem] w-[10rem] object-cover  px-2 py-4  "
            />
          </Link>
          <div className=" price py-4 w-full">
            <h1 className=" py-2 px-2">
              Product Name: {orderItem?.product.name}
            </h1>
            <div className=" flex justify-between ">
              <div className="w-[40rem]">
                <h1 className=" py-2 px-2">
                  Brand Name :{orderItem?.product.brand.name}
                </h1>

                {orderItem?.color && (
                  <h1 className="py-2 px-2">
                    Colour: <ColorSpan color={orderItem.color} />{" "}
                    {orderItem.color}
                  </h1>
                )}

                {orderItem?.size && (
                  <h1 className=" py-2 px-2">Size :{orderItem?.size}</h1>
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

              {reviewData?.review?.rating ? (
                <div className="mr-11">
                  <div className=" flex ">
                    <p>You Rated {reviewData?.review?.rating} Stars </p>
                    <div className=" self-center ml-2">
                      <MiniStarRatingComponent
                        reviewStars={reviewData?.review?.rating}
                      />
                    </div>
                  </div>

                  {reviewData?.review?.review === "" ? (
                    <ReviewModal
                      setNewData={setNewData}
                      buttonName="Add your Review"
                      reviewId={reviewData?.review?.id}
                      ProductImage={orderItem?.product.images[0].url}
                      ProductName={orderItem?.product.name}
                      ProductId={orderItem?.productId}
                      reviewStars={reviewData?.review?.rating}
                      reviewTitle={reviewData?.review?.reviewTitle}
                      reviewMessage={reviewData?.review?.review}
                      isPaid={isPaid}
                    />
                  ) : (
                    <div>
                      <p>Your Review is :</p>
                      <p>{reviewData?.review?.review}</p>
                      <ReviewModal
                        setNewData={setNewData}
                        reviewId={reviewData?.review?.id}
                        buttonName="Edit your Review"
                        reviewStars={reviewData?.review?.rating}
                        reviewTitle={reviewData?.review?.reviewTitle}
                        reviewMessage={reviewData?.review?.review}
                        ProductImage={orderItem?.product.images[0].url}
                        ProductName={orderItem?.product.name}
                        ProductId={orderItem?.productId}
                        isPaid={isPaid}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mr-11">
                  <ReviewModal
                    setNewData={setNewData}
                    buttonName="Rate the product"
                    reviewId={reviewData?.review?.id}
                    ProductImage={orderItem?.product.images[0].url}
                    ProductName={orderItem?.product.name}
                    ProductId={orderItem?.productId}
                    reviewStars={reviewData?.review?.rating}
                    reviewTitle={reviewData?.review?.reviewTitle}
                    reviewMessage={reviewData?.review?.review}
                    isPaid={isPaid}
                  />
                </div>
              )}

              {/* */}
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default OrderDetailsComponent;
