"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useTransition } from "react";
import { ReviewSchema } from "@/schemas";
import { Reset } from "@/actions/email/reset-password";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import StarRatingComponent from "./rating star component/StarRatingComponent";
import Image from "next/image";
import { ValidatedReviewData } from "@/actions/productRating/validatedReviewData";
import ReviewImageUpload from "./ReviewImageUpload";

export function ReviewModal({
  buttonColour,
  setNewData,
  buttonName,
  ProductImage,
  ProductName,
  ProductId,
  isPaid,
  reviewStars,
  reviewTitle,
  reviewMessage,
  reviewId,
}: {
  buttonName: string;
  ProductImage: string;
  ProductName: string;
  ProductId: string;
  isPaid: boolean;
  reviewId?: string;
  reviewStars?: number;
  reviewTitle?: string;
  reviewMessage?: string;
}) {
  // console.log("this is the isPaid data from the review Modal", isPaid);
  const { toast } = useToast();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [Modalerror, setModalError] = useState<string | undefined>("");
  const [Modalsuccess, setModalSuccess] = useState<string | undefined>("");
  const [starRating, setStarRating] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);

  // useEffect(() => {

  //   alert("this is the star rating"+starRating)
  // }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array

    // Extract file names from the array of files
    const fileNames = files.map((file) => file.name);

    // Update state with selected file names
    setSelectedFiles(fileNames);

    // Optionally, you can also handle other file details here if needed
    // console.log("Selected files:", files);
  };

  const {
    register: reviewField,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      images: [],
      title: "",
      review: "",
    },
    mode: "onBlur", // Validate on blur
  });

  // Watch the images field
  const images = watch("images", []);

  // this useffect needs to run everytime the modal is opened
  useEffect(() => {
    if (isOpen && (reviewTitle || reviewMessage || reviewStars)) {
      setValue("review", reviewMessage || "");
      setValue("rating", reviewStars || 0);
      setValue("title", reviewTitle || "");
      // console.log("Setting initial form values");
    }
  }, [isOpen]);

  useEffect(() => {
    setValue("rating", starRating); // Sync starRating with form state
    // alert("this is the star rating"+starRating)
    // console.log("this is the star rating", starRating);
  }, [starRating]);

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    setModalError("");
    setModalSuccess("");
    // console.log("this is the values", values);
    // console.log("this is the star rating", starRating);
    // alert("this is the star rating" + starRating);

    // alert("form submitted")
    startTransition(() => {
      // console.log("Form values:", values);
      ValidatedReviewData(values, ProductId, reviewId, isPaid)
        .then((data) => {
          if (data?.error) {
            reset();
            setStarRating(0);
            setModalError(data.error);
          }

          if (data?.success) {
            reset();
            setStarRating(0);

            setModalSuccess(data.success);
          }
        })
        .catch(() => setModalError("Something went wrong"));
    });

    handleModalClose();
  };

  // useEffect(() => {
  //   if (Modalerror) {
  //     // alert(error);
  //     toast({
  //       title: `${Modalerror}`,
  //       description:
  //         "Password rest link has been sent to your email address. Please check your email to reset your password.",
  //     });
  //   }
  //   if (Modalsuccess) {
  //     // alert(success);
  //     toast({
  //       title: `${Modalsuccess}`,
  //       description:
  //         "Password rest link has been sent to your email address. Please check your email to reset your password.",
  //     });
  //   }
  // }, [Modalerror, Modalsuccess]);

  // Function to handle modal close

  const handleModalClose = () => {
    setIsOpen(false);
    setModalError("");
    setModalSuccess("");
    setSelectedFiles([]); // Clear selected files state
    setNewData(prev => !prev);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setModalError("");
          setModalSuccess("");
          handleModalClose(); // Reset state when modal closes
          reset(); // Reset form when modal closes
        }
      }}
    >
      <div className=" ">
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
          <button className={`w-auto below-445:w-[6rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2   ${buttonColour ? buttonColour : "bg-teal-600"}`}>
            <h1 className=" font-bold below-868:text-[0.8rem] uppercase">{buttonName} </h1>
          </button>
        </DialogTrigger>
        <DialogContent className=" h-[41rem] below-1265:h-[35rem] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className=" flex">
                  <div className="w-[4rem] overflow-hidden h-[4rem] border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 text-[1.1rem]  ">
                    <Image
                      src={ProductImage}
                      width={100}
                      height={100}
                      className=" h-[5.5rem]  object-contain "
                    />
                  </div>
                  <h1 className=" h-[4rem] border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 pt-4 text-[1.1rem]  below-600:text-[0.7rem] bg-yellow-400">
                    {ProductName}
                  </h1>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className=" main flex below-600:flex-col below-600:overflow-y-auto bg-pink-500 below-1265:h-[23rem]  h-[30rem]  border-2 border-black border-b-8 border-r-4">
              <div className=" left flex-1 pl-5">
                {/* star rating component */}
                <div className="">
                  <div>
                    <h1 className="w-[25rem] below-1000:w-[15rem]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400">
                      <h1 className=" font-bold text-[1.5rem] below-1265:text-[1.2rem] below-1000:text-[0.8rem] uppercase">
                        How would you rate it ?
                      </h1>
                    </h1>
                  </div>
                  <div className=" flex mt-2 ml-8">
                    <StarRatingComponent setStarRating={setStarRating} reviewStars={reviewStars}  />
                  </div>

                  <input
                    {...reviewField("rating")}
                    type="hidden"
                    value={starRating}
                  />
                  {errors.rating && (
                    <span className="italic text-red-950 text-[1.1rem]">
                      {errors.rating.message}
                    </span>
                  )}
                </div>

                <div>
                  <div className=" mt-2">
                    {/* image upload component */}
                    {/* <div>
                    <h1 className="w-[25rem]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400">
                      <h1 className=" font-bold text-[1.5rem]">
                        Share the Photos{" "}
                      </h1>
                    </h1>
                  </div> */}
                    <div className="">
                      {/* showing selected files component */}
                      <div className=" flex">
                        <div className=" w-[22rem] mt-7">
                          {/* <label
                            htmlFor="fileInput"
                            className="relative cursor-pointer  h-[6rem] p-2 border-2 border-black bg-white text-black mt-4 flex justify-center items-center border-b-8 border-r-4 focus:outline-none"
                          > */}
                          {/* <Camera size={50} strokeWidth={1} />

                            {selectedFiles.length > 0 ? (
                              <span className="ml-8">Images Selected</span>
                            ) : (
                              <span className="ml-8">Upload your Photos</span>
                            )} */}

                          {/* <CldUploadWidget onUpload={onUpload} uploadPreset="mjsgvhim">
                          {({ open }) => {
                            const onClick = () => {
                              open();
                            };

                          <input
                            id="fileInput"
                            {...reviewField("images")}
                            type="images"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            multiple // Allow multiple file selection
                          />
                        }}
                        </CldUploadWidget> */}
                          {/* disbaling the share photo will add this functionality later as bugs */}
                          {/* <div>
                            <ReviewImageUpload
                        value={images.map((image) => ({ url: image }))}
                        onChange={(url) => setValue("images", [...images, url])}
                        onRemove={(url) => setValue("images", images.filter((current) => current !== url))}
                      />
                            </div> */}
                          {/* </label> */}
                          {errors.images && (
                            <span className=" italic text-red-950  text-[1.1rem]">
                              {errors.images.message}
                            </span>
                          )}
                        </div>

                        {/* Container with white background for selected file names */}
                        <div className=" pl-2">
                          {selectedFiles.length > 0 && (
                            <div className=" mr-2 ">
                              <h2 className="text-xl font-bold mt-2 ">
                                Selected Files:
                              </h2>
                              <div className="bg-white p-4 border border-gray-200 shadow-md mt-2 h-[6rem] overflow-y-auto">
                                <ul className="list-disc list-inside">
                                  {selectedFiles.map((fileName, index) => (
                                    <li key={index}>{fileName}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" right flex-1">
                <div>
                  {/* review Title */}
                  <div>
                    <h1 className="w-[30rem] below-1000:w-[15rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400">
                      <h1 className=" font-bold text-[1.5rem] below-1265:text-[1.2rem] below-1000:text-[0.8rem] uppercase">
                        Title your Review
                      </h1>
                    </h1>
                  </div>
                  <div>
                    <input
                      type="text"
                      {...reviewField("title")}
                      placeholder="Whats most important to know?"
                      className=" w-[30rem] below-1000:w-full h-[3rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                    />
                  </div>
                  {errors.title && (
                    <span className=" italic text-red-950  text-[1.1rem]">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div>
                  <div>
                    {/* review textArea */}
                    <h1 className="w-[30rem]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400 below-1000:w-[15rem]">
                      <h1 className=" font-bold text-[1.5rem] below-1265:text-[1.2rem] below-1000:text-[0.8rem] uppercase">
                        Write your Review
                      </h1>
                    </h1>
                  </div>
                  <div>
                    <textarea
                      {...reviewField("review")}
                      placeholder="What did you like or dislike? What did you use this product for?"
                      className=" w-[30rem] below-1000:w-full h-[13.5rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none below-1265:h-[7rem]"
                    />
                  </div>
                  {errors.review && (
                    <span className=" italic text-red-950  text-[1.1rem]">
                      {errors.review.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className=" text-2xl font-bold">
                  Email
                </Label>
                <input
                  type="text"
                  placeholder="Please enter your Email "
                  {...registerField("email")}
                  className="w-[18rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                />
              </div>
              {errors.email && (
                <span className=" italic text-red-950  text-[1.1rem]">
                  {errors.email.message}
                </span>
              )}
              {Modalerror && (
                <span className=" italic text-red-950  text-[1.1rem]">
                  {Modalerror}
                </span>
              )}
              {Modalsuccess && (
                <span className=" italic text-yellow-600  text-[1.1rem]">
                  {Modalsuccess} {"Please check your email for the reset link"}
                </span>
              )}
            </div> */}
            <div></div>
            <DialogFooter>
              <button
                type="submit"
                className="w-[12rem] h-[3rem]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-yellow-400"
              >
                <h1 className=" font-bold">Submit </h1>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}
