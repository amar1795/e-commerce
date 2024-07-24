"use client";
import UploadImage from "@/components/uploadImage";

import React, { startTransition, use, useEffect, useState } from "react";
import { Check, CircleCheckBig, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  RadioGroupComponent,
  formatAddress,
} from "@/components/RadioGroupComponent";
import { AddressSchema, PaymentSchema, UpdatePasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  addAddressToUser,
  getAllAddressesForUser,
} from "@/actions/user-account/userAddress";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/ui/use-toast";
import { userCheckoutPayment } from "@/actions/user-account/userpayment";
import StyledButton from "@/components/styled Button/StyledButton";
import { fetchUserCards } from "@/actions/payments/fetchAllCards";
import Image from "next/image";
import { DeleteModal } from "@/components/deleteModal";
import { UpdateModal } from "@/components/UpdateModal";
import { getUserNameandEmailData } from "@/actions/update User Settings/fetchnameAndEmail";
import { updateTwoStepVerificationStatus } from "@/actions/update User Settings/twoStepVerifcationUpdate";
import CustomUserAvatar from "@/components/CustomAvatar";
import { getUserById } from "@/data/user";
import { signOut } from "next-auth/react";
import { logout } from "@/actions/logout";
import getUserWallet from "@/actions/payments/getUserWallet";
import { redirect, useRouter } from "next/navigation";
import LoadingButton from "@/components/loading Button/loadingButton";
import { updatePassword } from "@/actions/email/UpdatePassword";

const page = () => {
  const user = useCurrentUser();
  // console.log("this is the user", user?.email);
  const router = useRouter();
  const email = user?.email;
  const [activeTab, setActiveTab] = useState("credit");

  const { toast } = useToast();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [alladdress, setalladdress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [paymentData, setPaymentData] = useState([]);
  const [AllUserCards, setAllUserCards] = useState([]);
  const [personalInformation, setPersonalInformation] = useState([]);
  const [newData, setNewData] = useState(true);
  const [userImage, setUserImage] = useState("");
  const [fetchImage, setfetchImage] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [creditTransaction, setCreditTransaction] = useState([]);
  const [debitTransaction, setDebitTransaction] = useState([]);
  const [walletData, setWalletData] = useState([]);
  // console.log("this is the credit transaction", creditTransaction);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);

  const [loading, setLoading] = useState(false);
  // const [toastData, setToastData] = useState({});
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState();
  // personalInformation?.data?.isTwoFactorEnabled

  // console.log("this is the isTwoFactorEnabled", isTwoFactorEnabled);
  const [initialState, setInitialState] = useState(
    personalInformation?.data?.isTwoFactorEnabled
  );

  const [showSaveChanges, setShowSaveChanges] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // This will format the time in 12-hour format with AM/PM
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const data = async () => {
      const alladdress = await getAllAddressesForUser(user?.id);
      // console.log("All Address: ", alladdress);
      setalladdress(alladdress);
      const allUserCards = await fetchUserCards(user?.id);
      setAllUserCards(allUserCards);
      const walletData = await getUserWallet();
      setWalletData(walletData);
      // console.log("this is the wallet data", walletData);
      const transactionData = walletData?.wallet?.transactions;

      if (transactionData) {
        const creditTransactions = [];
        const debitTransactions = [];

        transactionData.forEach((transaction) => {
          if (transaction.type === "CREDIT") {
            creditTransactions.push(transaction);
          } else {
            debitTransactions.push(transaction);
          }
        });

        setCreditTransaction(creditTransactions);
        setDebitTransaction(debitTransactions);
      }

      // if (transactionData.type === "CREDIT") {
      //   setCreditTransaction(transactionData);
      // } else {
      //   setDebitTransaction(transactionData);
      // }
      // console.log("this is the wallet data created", transactionData);

      //   {
      //     "id": "668f82acdfb64b86fd862474",
      //     "walletId": "668f82acdfb64b86fd862473",
      //     "amount": 100000,
      //     "type": "CREDIT",
      //     "description": "Initial deposit",
      //     "createdAt": "2024-07-11T06:58:52.318Z",
      //     "updatedAt": "2024-07-11T06:58:52.318Z"
      // }

      setWalletBalance(walletData?.wallet?.balance || 0);
      const personalData = await getUserNameandEmailData();
      setPersonalInformation(personalData.data);
      setIsTwoFactorEnabled(personalData.data.isTwoFactorEnabled);

      setIsAllDataFetched(true);
    };

    data();
  }, [success, newData]);

  useEffect(() => {
    const fetchUpdatedImage = async () => {
      const newData = await getUserById(user?.id);
      setUserImage(newData?.image);
      // console.log("this is the new data", newData);
    };
    fetchUpdatedImage();
  }, []);

  // useEffect(() => {
  //   const handleRouteChangeStart = () => setLoading(true);
  //   const handleRouteChangeComplete = () => setLoading(false);

  //   router.events.on("routeChangeStart", handleRouteChangeStart);
  //   router.events.on("routeChangeComplete", handleRouteChangeComplete);

  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChangeStart);
  //     router.events.off("routeChangeComplete", handleRouteChangeComplete);
  //   };
  // }, [router]);

  const fetchUpdatedImage = async () => {
    const newData = await getUserById(user?.id);
    setUserImage(newData?.image);
    // console.log("this is the new data", newData);

    toast({
      title: "Updated Profile Image",
      description: "Successfully Updated the Profile Image",
    });
  };

  useEffect(() => {
    setInitialState(personalInformation?.data?.isTwoFactorEnabled);
    setShowSaveChanges(false); // Initially hide Save Changes button
  }, [personalInformation?.data?.isTwoFactorEnabled]);

  // useEffect(() => {
  //   // Check if current state is different from initial state
  //     setShowSaveChanges(isTwoFactorEnabled !== personalInformation?.data?.isTwoFactorEnabled);
  // }, [isTwoFactorEnabled, personalInformation?.data?.isTwoFactorEnabled]);

  // this will show the Data in the update Modal in the toast
  const setToastData = (data) => {
    toast(data);
  };

  const toggleTwoFactor = (e) => {
    e.preventDefault();
    setIsTwoFactorEnabled(!isTwoFactorEnabled); // Toggle the state using the previous state
    // setShowSaveChanges(true); // Show Save Changes whenever toggled
    setShowSaveChanges(
      isTwoFactorEnabled !== personalInformation?.data?.isTwoFactorEnabled
    );
  };

  const saveChanges = () => {
    // Implement the function to save changes to the database
    setInitialState(isTwoFactorEnabled); // Update the initial state to match the new saved state
    setShowSaveChanges(false); // Hide Save Changes after saving
    updateTwoStepVerificationStatus({ isTwoFactorEnabled })
      .then((data) => {
        if (data.data) {
          toast({
            title: "Two Step Verifictation enabled",
            description:
              "Successfully Updated the two step Verification Status",
          });
        } else {
          toast({
            title: "Two Step Verifictation Disabled",
            variant: "destructive",
            description:
              "Successfully Updated the two step Verification Status",
          });
        }
        // alert(data.message);
      })
      .catch((error) => {
        console.error("Error updating two-step verification status:", error);
        setToastData("Failed to update two-step verification status");
      });
  };

  // need to restructure these helper functions later
  const formatToINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // console.log("this is the user", user);
  // console.log("All Address: ", alladdress);
  // console.log("All User Cards: ", AllUserCards);

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: errorsPayment },
    trigger: triggerPayment,
    reset: resetPayment,
  } = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      nameOnCard: "",
    },
    mode: "onBlur",
  });

  const onSubmitPayment = async (values: z.infer<typeof PaymentSchema>) => {
    // Check if the address is selected before proceeding

    setError("");
    setSuccess("");
    try {
      startTransition(async () => {
        try {
          const data = await userCheckoutPayment(user?.id, values);
          setError(data.error);
          setSuccess(data.success);
          setPaymentData(data.paymentRecord);
        } catch (error) {
          console.error("Error adding the card :", error);
          setError("Failed to add the card details. Please try again.");
        } finally {
          resetPayment();
        }
      });

      // Await until the transition is complete to mimic a loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Successfully Added the Card details",
        description: "Successfully Add the Card details",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to Add the Card Details . Please try again.",
      });
      setError("Failed to Add the Card Details. Please try again.");
    }
  };

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      country: "",
      firstName: "",
      lastName: "",
      apartment: "",
      street: "",
      city: "",
      state: "",
      landmark: "",
      postalCode: "",
      phoneNumber: "",
    },
    mode: "onBlur", // Validate on blur
  });

  const onSubmit = (values: z.infer<typeof AddressSchema>) => {
    setError("");
    setSuccess("");
    // alert(values.email);

    startTransition(() => {
      addAddressToUser(user?.id, values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        reset();
      });
    });

    toast({
      title: "Successfully added the address",
      description: "You have successfully added the address",
    });
  };

  const {
    register: NewPasswordField,
    handleSubmit: handleSubmitNewPassword,
    formState: { errors: errorsUpdatePassword },
    reset: resetUpdatePassword,
  } = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitNewPassword = (
    values: z.infer<typeof UpdatePasswordSchema>
  ) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      updatePassword(email, values)
        .then((data) => {
          if (data?.error) {
            // resetUpdatePassword();
            setError(data.error);
            toast({
              title: `${data?.error}`,
              description:
                `${data?.error}`,
                variant: "destructive",
            });

            // setModalErrorToast(data.error);
          }

          if (data?.success) {
            resetUpdatePassword();

            setSuccess(data.success);
            toast({
              title: "Password Updated!",
              description:
                "You have successfully updated the password",
            });
            // setTimeout(() => {
            //   router.push('/password-reset'); // Replace with your target page URL
            // }, 2000); // 2000 milliseconds = 2 seconds
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  const handleAddressChange = (address) => {
    // formatAddress
    toast({
      title: "Shipping Address Selected",
      description: `Your Shipping Address is: ${formatAddress(address)}`,
    });
    setSelectedAddress(address);

    // console.log("Selected Address: ", selectedAddress?.id);
    // alert(`Your Shipping Address is: ${formatAddress(address)}`);
  };

  const [isSelected, setIsSelected] = useState(false);

  // const toggleColor = (e) => {
  //   e.preventDefault();
  //   setIsSelected(!isSelected);
  // };

  const initiateLogout = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
    await logout();
  };

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="overflow-hidden border-2 border-black  flex flex-col ">
      <div className=" bg-violet-600 w-full border-b-4 border-black fixed top-0 left-0 right-0 z-10">
        <div className="flex px-16 items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-center mt-4 uppercase">
              Profile
            </h1>
            <h1 className="mb-5 font-bold text-[25px] uppercase">
              Update your profile
            </h1>
          </div>

          <div>
            <div className=" py-4">
              <div className=" flex">
                <div>
                  <h1 className="text-[2rem]">Hello,</h1>
                  <h1 className=" self-center mr-4 text-[2rem] uppercase font-bold">
                    {user?.name?.split(" ")[0]}
                  </h1>
                </div>
                <CustomUserAvatar src={userImage} />
              </div>
            </div>
          </div>

          <div className=" flex">
            <div className="h-[4rem]">
              <Link href="/orders">
                <button className=" mr-12 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-400">
                  <h1 className="font-bold">
                    See your Complete Order's History{" "}
                  </h1>
                </button>
              </Link>
            </div>
            <div className="h-[4rem]">
              {/* <Link href="/"> */}
              <button
                onClick={handleClick}
                disabled={!isAllDataFetched} // Disable the button until all data is fetched
                className={`mr-12 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-600 ${
                  !isAllDataFetched ? "cursor-not-allowed" : ""
                }`}
              >
                {isAllDataFetched ? (
                  <h1 className="font-bold">Back to Home Page</h1>
                ) : (
                  <LoadingButton />
                )}
              </button>
              {/* </Link> */}
            </div>
            <div className="h-[4rem]">
              <button
                onClick={() => initiateLogout()}
                className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-600"
              >
                <h1 className="font-bold">Logout</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 ">
        {/* Adjust this margin-top to ensure content starts below the fixed topbar */}
        <div className="bg-pink-600 flex-1 border-2 border-black min-h-96 px-[5rem] ">
          {/* profile photo */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4  w-[34rem]">
                <h1 className=" text-4xl font-bold">Profile Photo</h1>
                <p className=" text-2xl mt-4">
                  {" "}
                  This image will appear as your profile photo
                </p>
                <div className=" mt-4">
                  {<CustomUserAvatar src={userImage} />}
                </div>
              </div>
              <div className="flex flex-col    border-2 border-black flex-1  h-[20rem]  ">
                <div className=" flex px-4 py-4 justify-between h-full">
                  <div>
                    <div className=" pl-[2rem] pt-4 flex   h-[10rem] w-full">
                      <UploadImage fetchUpdatedImage={fetchUpdatedImage} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* personal information  */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold">Personal information </h1>
                <p className=" text-2xl  mt-4">
                  Upload your personal information here
                </p>
              </div>
              <div className="flex flex-col  border-2 border-black w-[50vw]   ">
                <div className=" flex px-4 py-4 justify-center h-full ">
                  <div>
                    <form className="">
                      <div className="flex flex-col items-center">
                        <div className=" flex ">
                          <div className=" flex ">
                            <h3 className=" w-[16rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 mr-4">
                              {personalInformation.firstName}
                            </h3>
                            <h3 className=" w-[16rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                              {personalInformation.lastName}
                            </h3>
                          </div>

                          <div>
                            <UpdateModal
                              buttonName={"Update"}
                              inputData={"name"}
                              data={personalInformation}
                              setNewData={setNewData}
                              setToastData={setToastData}
                            />
                          </div>
                        </div>
                        <div className=" flex ">
                          <h3 className=" w-[34rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 ">
                            {personalInformation.email}
                          </h3>
                          <UpdateModal
                            buttonName={"Update"}
                            inputData={"email"}
                            data={personalInformation}
                            setNewData={setNewData}
                            setToastData={setToastData}
                          />
                        </div>
                        <div className=" mt-4 flex h-full ">
                          <h3 className=" w-[25rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                            Enable two Step Verification
                          </h3>
                          <div className=" h-[4rem] mr-4">
                            {isTwoFactorEnabled !== undefined && (
                              <button
                                className="p-1 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 ml-2 bg-green-500"
                                onClick={toggleTwoFactor}
                              >
                                <div
                                  className={`h-6 w-6 ${
                                    isTwoFactorEnabled === true
                                      ? "bg-black"
                                      : "bg-white"
                                  }`}
                                >
                                  {/* Add an empty space to keep the div rendered */}
                                  &nbsp;
                                </div>
                              </button>
                            )}
                          </div>
                          {showSaveChanges && (
                            <button
                              className="p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500"
                              onClick={saveChanges}
                            >
                              <h1 className="font-bold">Save Changes</h1>
                            </button>
                          )}
                        </div>

                        <div></div>
                        <div className=" flex">
                          {personalInformation.emailVerified ? (
                            <div className=" h-[4rem]">
                              <div className="  p-2  ml-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4  bg-green-500">
                                <h1 className=" font-bold">
                                  <div className=" flex">
                                    <Check className=" mr-2" />
                                    <span>{"Your Email is Verified"}</span>
                                  </div>
                                </h1>
                              </div>
                            </div>
                          ) : (
                            <div className=" h-[4rem]">
                              <button className="  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-500">
                                <h1 className=" font-bold">
                                  {" "}
                                  Please Verify Your Email{" "}
                                </h1>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* <div className=" bg-yellow-500 border-t-2 border-black h-[5rem] flex w-full justify-end">
                  <div className=" flex pr-5 pb-6">
                    <div className="h-[4rem] ">
                      <button className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-red-600 mr-4">
                        <h1 className="font-bold">Cancel</h1>
                      </button>
                    </div>
                    <div className="h-[4rem]">
                      <button className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-pink-500">
                        <h1 className="font-bold">Save</h1>
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          {/*user  addresss */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4  w-full">
                <h1 className=" text-4xl font-bold">Your Address </h1>
                <p className=" text-2xl  mt-4">
                  Upload/update your address here
                </p>
              </div>
            </div>
            <div className="  m-5 mx-10">
              <div className=" flex">
                <div className=" flex-1">
                  <div className=" mb-8 ">
                    <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                      Shipping Address
                    </h3>
                  </div>
                  <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                    <input
                      type="text"
                      {...registerField("country")}
                      placeholder="Country"
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errors.country && (
                      <span className=" italic text-red-950  text-[1.1rem]">
                        {errors.country.message}
                      </span>
                    )}
                    <div className="flex justify-between ">
                      <div className=" flex flex-col w-full">
                        <input
                          type="text"
                          {...registerField("firstName")}
                          placeholder="First Name"
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.firstName && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div className=" flex flex-col w-full">
                        <input
                          type="text"
                          {...registerField("lastName")}
                          placeholder="Last Name"
                          className="w-full ml-5 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.lastName && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      {...registerField("apartment")}
                      placeholder="Apartment, suite etc."
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errors.apartment && (
                      <span className=" italic text-red-950  text-[1.1rem]">
                        {errors.apartment.message}
                      </span>
                    )}
                    <input
                      type="text"
                      {...registerField("street")}
                      placeholder="Street"
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errors.street && (
                      <span className=" italic text-red-950  text-[1.1rem]">
                        {errors.street.message}
                      </span>
                    )}
                    <div className="flex">
                      <div className=" flex flex-col w-full">
                        <input
                          type="text"
                          {...registerField("city")}
                          placeholder="City"
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.city && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.city.message}
                          </span>
                        )}
                      </div>
                      <div className=" flex flex-col w-full">
                        <input
                          type="text"
                          {...registerField("state")}
                          placeholder="State"
                          className="w-full ml-5 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.state && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.state.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      {...registerField("landmark")}
                      placeholder="Landmark"
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errors.landmark && (
                      <span className=" italic text-red-950  text-[1.1rem]">
                        {errors.landmark.message}
                      </span>
                    )}
                    <div className="flex ">
                      <div className=" flex flex-col  w-full">
                        <input
                          type="text"
                          {...registerField("postalCode")}
                          placeholder="Postal Code"
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.postalCode && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.postalCode.message}
                          </span>
                        )}
                      </div>
                      <div className=" flex flex-col w-full">
                        <input
                          type="text"
                          {...registerField("phoneNumber")}
                          placeholder="Phone Number"
                          className="w-full ml-5 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                        />
                        {errors.phoneNumber && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-[4rem] flex">
                      <button
                        type="submit"
                        className="w-80 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500"
                      >
                        <h1 className="font-bold">Submit</h1>
                      </button>
                      <button
                        type="button"
                        className="w-80 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500 ml-4"
                        onClick={() => {
                          reset(); // Call the reset method from useForm
                        }}
                      >
                        <h1 className="font-bold">Reset</h1>
                      </button>
                    </div>
                  </form>
                </div>

                <div className=" flex-1 ml-14 pl-14">
                  <div className="   mb-8 ">
                    <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                      Saved Address
                    </h3>
                  </div>
                  <div>
                    <div></div>

                    <RadioGroupComponent
                      address={alladdress}
                      selectedAddress={selectedAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* user card details */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold">Your Card Details</h1>
                <p className=" text-2xl  mt-4">
                  Add/Update your Card information here
                </p>
              </div>
            </div>
            <div className=" m-8  flex  justify-between">
              <div>
                <form
                  // ref={formRef}
                  onSubmit={handleSubmitPayment(onSubmitPayment)}
                >
                  <div className="w-[20rem] pt-5">
                    <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                      Payment Method
                    </h3>
                    <input
                      type="text"
                      {...registerPayment("cardNumber")}
                      placeholder="Card Number"
                      className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                      // onInput={formatCardNumber}
                    />
                    {errorsPayment.cardNumber && (
                      <span className="italic text-red-950 text-[1.1rem]">
                        {errorsPayment.cardNumber.message}
                      </span>
                    )}
                    <input
                      type="text"
                      {...registerPayment("expirationDate")}
                      placeholder="MM/YY"
                      className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                      // onInput={formatExpirationDate}
                    />
                    {errorsPayment.expirationDate && (
                      <span className="italic text-red-950 text-[1.1rem]">
                        {errorsPayment.expirationDate.message}
                      </span>
                    )}
                    <input
                      type="text"
                      {...registerPayment("cvv")}
                      placeholder="CVV"
                      className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                      // onInput={restrictCvv}
                    />
                    {errorsPayment.cvv && (
                      <span className="italic text-red-950 text-[1.1rem]">
                        {errorsPayment.cvv.message}
                      </span>
                    )}
                    <input
                      type="text"
                      {...registerPayment("nameOnCard")}
                      placeholder="Name on card"
                      className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errorsPayment.nameOnCard && (
                      <span className="italic text-red-950 text-[1.1rem]">
                        {errorsPayment.nameOnCard.message}
                      </span>
                    )}

                    <div className=" mt-5">
                      <StyledButton buttonName="Add Card" />
                    </div>
                  </div>
                </form>
              </div>
              <div className=" mr-2">
                <div className="w-[20rem] pt-5 mr-[20rem] ">
                  <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                    Saved Cards
                  </h3>
                  {/* cardHolderName: true,
                cardExpiry: true,
                lastFourDigits: true */}

                  <div className="overflow-auto h-[20rem] w-[42rem] mt-4 border-2 border-black px-2  ">
                    <div className=" mt-4 ">
                      {AllUserCards.map((card) => (
                        <div
                          key={card.id}
                          className="w-[40rem] h-[4rem] mt-2 text-[1rem] leading-none p-2 border-2 border-black text-black  border-b-8 border-r-4 bg-yellow-500"
                        >
                          <div className=" flex justify-between h-full">
                            <div className=" flex ">
                              <div className=" h-full">
                                <Image
                                  src="/1.jpg"
                                  width={50}
                                  height={50}
                                  alt="Logo"
                                  className=" rounded-md mr-2"
                                />
                              </div>
                              <div className=" flex flex-col justify-between h-full ">
                                <div className=" flex">
                                  <p>{card.cardHolderName}</p>
                                  <div className=" flex ml-4">
                                    <p>VISA </p>
                                    <p> **** {card.lastFourDigits}</p>
                                  </div>
                                </div>
                                <p>Expires :{card.cardExpiry} </p>
                              </div>
                            </div>
                            <div className=" flex self-center">
                              <DeleteModal />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* user wallet details */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold">Your Wallet Details </h1>
                <p className=" text-2xl  mt-4">
                  See your Wallet related Details Here
                </p>
                <div>
                  <div className=" flex mt-4">
                    <div className=" w-[25rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                      <div className=" p-4 px-4">
                        <h1 className=" text-[2rem]"> Available balance</h1>
                        <h1 className=" mt-4 text-[1.8rem]">
                          {formatToINR(walletBalance)}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-5 w-[15rem]">
                    <StyledButton buttonName="Add Money" />
                  </div>
                </div>
              </div>

              <div className=" flex-1 ">
                <div className=" flex justify-around ">
                  <div className="   mb-8 ">
                    <button
                      type="button"
                      className={`w-[15rem] p-2 border-2 border-black  mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  ml-4  ${
                        activeTab === "credit"
                          ? "bg-white text-black"
                          : "bg-yellow-400 text-black"
                      }`}
                      onClick={() => setActiveTab("credit")}
                    >
                      <h1 className="font-bold">Credit History</h1>
                    </button>
                  </div>
                  <div className="   mb-8 ">
                    <button
                      type="button"
                      className={`w-[15rem] p-2 border-2 border-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 ml-4 ${
                        activeTab === "debit"
                          ? "bg-white text-black"
                          : "bg-yellow-400 text-black"
                      }`}
                      onClick={() => setActiveTab("debit")}
                    >
                      <h1 className="font-bold">Debit History</h1>
                    </button>
                  </div>
                </div>

                <div className=" bg-teal-600 h-[20rem] w-full border-black border-2">
                  {activeTab === "credit" && (
                    <div className=" px-4 mt-2  overflow-y-auto">
                      {creditTransaction &&
                        creditTransaction.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between border-b-8 border-r-4  bg-white border-black border-2 px-2"
                          >
                            <div className=" ">
                              <div className="left  flex pt-2">
                                <div className="   w-[5rem]">
                                  <div className=" flex justify-center ">
                                    <CircleCheckBig
                                      size={30}
                                      strokeWidth={1}
                                      color="green"
                                    />
                                  </div>
                                  <div className=" flex justify-center">
                                    <h1 className=" text-green-600">Success</h1>
                                  </div>
                                </div>
                                <div>
                                  <div>Remarks :{transaction.description}</div>
                                  <div>{formatDate(transaction.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                            <div className=" flex flex-col mt-2">
                              <div className="  ">
                                Transaction Id:{transaction?.id}
                              </div>
                              <div className=" text-green-800  ">
                                {formatToINR(transaction.amount)} Credit
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {activeTab === "debit" && (
                    <div className=" px-4 mt-2  overflow-y-auto">
                      {debitTransaction != "" ? (
                        debitTransaction.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between border-b-8 border-r-4  bg-white border-black border-2 px-2"
                          >
                            <div className=" ">
                              <div className="left  flex pt-2">
                                <div className="   w-[5rem]">
                                  <div className=" flex justify-center ">
                                    <CircleCheckBig
                                      size={30}
                                      strokeWidth={1}
                                      color="green"
                                    />
                                  </div>
                                  <div className=" flex justify-center">
                                    <h1 className=" text-green-600">Success</h1>
                                  </div>
                                </div>
                                <div>
                                  <div>Remarks :{transaction.description}</div>
                                  <div>{formatDate(transaction.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                            <div className=" flex flex-col mt-2">
                              <div className="  ">
                                Transaction Id:{transaction?.id}
                              </div>
                              <div className=" text-red-800  ">
                                {formatToINR(transaction.amount)} Debit
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className=" h-[40vh] bg-pink-600  text-center">
                          <h1 className=" text-[2rem] uppercase">
                            {" "}
                            No transactions made yet{" "}
                          </h1>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* password update */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold">Update Password </h1>
                <p className=" text-2xl  mt-4">
                  Enter your Current Password to update it{" "}
                </p>
              </div>
                    <form  action=""
                      onSubmit={handleSubmitNewPassword(onSubmitNewPassword)}
                    >
              <div className="flex flex-col  border-2 border-black w-[50vw]  h-full  ">
                <div className=" flex px-4 py-4 justify-center h-full ">
                  <div>
                     
                      <div className="flex flex-col items-center">
                        <input
                          type="password"
                          placeholder="Current password"
                          {...NewPasswordField("currentPassword")}
                          className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                        />
                        {errorsUpdatePassword.currentPassword && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errorsUpdatePassword.currentPassword.message}
                          </span>
                        )}

                        <input
                          type="password"
                          placeholder="New password"
                          {...NewPasswordField("newPassword")}
                          className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                        />
                        {errorsUpdatePassword.newPassword && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errorsUpdatePassword.newPassword.message}
                          </span>
                        )}
                        <input
                          type="password"
                          placeholder="Confirm New password"
                          {...NewPasswordField("confirmNewPassword")}
                          className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                        />
                        {errorsUpdatePassword.confirmNewPassword && (
                          <span className=" italic text-red-950  text-[1.1rem]">
                            {errorsUpdatePassword.confirmNewPassword.message}
                          </span>
                        )}
                      </div>
                  </div>
                </div>
                <div className="  border-black h-[5rem] flex w-full justify-end">
                  <div className=" flex pr-5 pb-6">
                    <div className="h-[4rem] ">
                      <button
                        type="submit"
                        className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500 mr-4"
                      >
                        <h1 className="font-bold">Update Password</h1>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
