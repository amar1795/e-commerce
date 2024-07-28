"use client";
import UploadImage from "@/components/uploadImage";

import React, { startTransition, use, useEffect, useState } from "react";
import { Check, CircleCheckBig, Menu, Trash2, X } from "lucide-react";
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
import { da } from "@faker-js/faker";
import LoadingAnimation from "@/components/Loading/LoadingAnimation";

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
  const [NewCardData, setNewCardData] = useState(true);
  const [userImage, setUserImage] = useState("");
  const [fetchImage, setfetchImage] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [creditTransaction, setCreditTransaction] = useState([]);
  const [debitTransaction, setDebitTransaction] = useState([]);
  const [walletData, setWalletData] = useState([]);
  // console.log("this is the credit transaction", creditTransaction);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [loading, setLoading] = useState(true);
  // const [toastData, setToastData] = useState({});
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState();
  const [originalTwoFactorStatus, setOriginalTwoFactorStatus] = useState(false);
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
      // const allUserCards = await fetchUserCards(user?.id);
      // setAllUserCards(allUserCards);

      setLoading(true);
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

     

      setWalletBalance(walletData?.wallet?.balance || 0);
      setLoading(false);

      const personalData = await getUserNameandEmailData();
      setPersonalInformation(personalData.data);
      setIsTwoFactorEnabled(personalData.data.isTwoFactorEnabled);
      setOriginalTwoFactorStatus(personalData.data.isTwoFactorEnabled);
      setIsAllDataFetched(true);
    };

    data();
  }, [success, newData]);

  useEffect(() => {
    const data = async () => {
    const allUserCards = await fetchUserCards(user?.id);
    setAllUserCards(allUserCards);
    }

    data();
  }, [NewCardData]);

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
      isTwoFactorEnabled == originalTwoFactorStatus
    );

   
    
    
  };

  const saveChanges = () => {
    // Implement the function to save changes to the database
    setInitialState(isTwoFactorEnabled); // Update the initial state to match the new saved state
    setOriginalTwoFactorStatus(isTwoFactorEnabled); // Update the original state to match the new saved state
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
              description: `${data?.error}`,
              variant: "destructive",
            });

            // setModalErrorToast(data.error);
          }

          if (data?.success) {
            resetUpdatePassword();

            setSuccess(data.success);
            toast({
              title: "Password Updated!",
              description: "You have successfully updated the password",
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
    <div className=" overflow-hidden border-2 border-black  flex flex-col ">

      <div className="    bg-teal-600  w-[96vw] border-b-4 border-black fixed top-24 below-1319:top-36 left-8 right-8  pb-4 z-10 below-1319:pb-4 below-600:top-[15rem]
      below-600:w-[90vw] ">
      <div className="mt-4 ml-8">
        {isMenuOpen ? (
          <X onClick={toggleMenu} className="cursor-pointer" />
        ) : (
          <Menu onClick={toggleMenu} className="cursor-pointer" />
        )}
      </div>
      <div className={`flex px-16 items-center justify-between below-426:flex-col transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-center mt-4 uppercase below-1000:text-2xl">
              Profile
            </h1>

            <div className=" mt-4 mb-4 below-695:hidden">
              <h3 className="w-[20rem] uppercase text-[1.5rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-1000:text-[1rem]">
                Update Your Profile Information
              </h3>
            </div>
            <div className=" mt-4 mb-4 below-695:block hidden below-566:hidden">
              <h3 className="w-[20rem] uppercase text-[1.5rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-1000:text-[1rem] below-695:w-[10rem]">
                Update Info
              </h3>
            </div>
          </div>

          <div>
            <div className=" py-4 below-925:hidden">
              <div className=" flex ">
                <div className=" flex">
                  <h1 className="text-[1.5rem] self-center">Hello,</h1>
                  <h1 className=" self-center mr-4 text-[1.5rem] uppercase font-bold">
                    {user?.name?.split(" ")[0]}
                  </h1>
                </div>
                <CustomUserAvatar src={userImage} />
              </div>
            </div>
          </div>

          <div className=" flex below-1319:flex-col ">
            <div className="">
              <Link href="/orders">
                <button className=" mr-12 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-400">
                  <h1 className="font-bold below-1000:text-[0.8rem]">
                    Order's History{" "}
                  </h1>
                </button>
              </Link>
            </div>
            <div className="">
              {/* <Link href="/"> */}
              <button
                onClick={handleClick}
                disabled={!isAllDataFetched} // Disable the button until all data is fetched
                className={`mr-12 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-600 ${
                  !isAllDataFetched ? "cursor-not-allowed" : ""
                }`}
              >
                {isAllDataFetched ? (
                  <h1 className="font-bold below-1000:text-[0.8rem]">
                    Back to Home Page
                  </h1>
                ) : (
                  <LoadingButton />
                )}
              </button>
              {/* </Link> */}
            </div>
            <div className="">
              <button
                onClick={() => initiateLogout()}
                className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-600"
              >
                <h1 className="font-bold below-1000:text-[0.8rem]">Logout</h1>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 below-1319:mt-8 ">
        {/* Adjust this margin-top to ensure content starts below the fixed topbar */}
        <div className="bg-pink-600 flex-1 border-2 border-black min-h-96 px-[5rem] below-426:px-8 below-500:px-0  below-400:px-0 ">
          {/* profile photo */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6 below-500:pl-2  text-wrap below-695:flex-col below-566:items-center below-400:w-full ">
              <div className="  h-full pr-4  w-[34rem] below-695:w-[18rem] below-566:w-[15rem]  ">
                <h1 className=" text-4xl font-bold below-695:text-[1.5rem] uppercase">Profile Photo</h1>
                <p className=" text-2xl mt-4 below-695:text-[1rem] below-695:text-wrap uppercase ">
                  {" "}
                  This image will appear as your profile photo
                </p>
                <div className=" mt-4">
                  {<CustomUserAvatar src={userImage} />}
                </div>
              </div>
              <div className=" flex-col   below-695:flex below-695:mt-4   border-2 border-black flex-1  h-[20rem]  below-566:w-[16rem] below-500:w-[14rem] below-400:w-[14rem] ">
                <div className=" flex  px-4 py-4 below-500:px-0 justify-between h-full  ">
                  <div >
                    <div className=" pl-[2rem] below-500:pl-2 pt-4 flex below-695:pt-0 below-695:h-[12rem]  h-[10rem] w-full">
                      <UploadImage fetchUpdatedImage={fetchUpdatedImage} />
                    </div>
                    
                  </div>
                </div>
              </div>
            
            </div>
          </div>
          {/* personal information  */}
          <div className="  bg-teal-600 border-2 border-black  below-566:w-[18rem] below-500:w-full  mt-5  ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap below-868:flex-col below-868:items-center  ">
              <div className="  h-full pr-4 uppercase  below-868:mb-4">
                <h1 className=" text-4xl font-bold below-730:text-[1.2rem]">Personal information </h1>
                <p className=" text-2xl  mt-4 below-730:text-[1.2rem]">
                  Upload your personal information here
                </p>
              </div>
              <div className="flex flex-col  border-2 border-black w-[50vw] below-566:w-[18rem]  ">
                <div className=" flex px-4 py-4 justify-center h-full ">
                  <div>
                    <form className="">
                      <div className="flex flex-col items-center">
                        <div className=" flex ">
                          <div className=" flex ">
                            <h3 className=" w-[16rem] below-1265:w-[12rem] below-1000:w-[8rem] below-730:w-[5rem] below-730:text-[0.8rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 mr-4">
                              {personalInformation.firstName}
                            </h3>
                            <h3 className=" w-[16rem] below-1265:w-[12rem] below-1000:w-[8rem] below-730:w-[5rem] below-730:text-[0.8rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
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
                          <h3 className=" w-[34rem]  below-1265:w-[25rem] below-1000:w-[16rem] below-730:w-[10rem] below-730:text-[0.8rem] h-[3.4rem] pt-4 mt-3 text-[1rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 ">
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
                        <div className=" mt-4 flex h-full below-500:hidden ">
                          

                         
                          <h3 className=" uppercase w-[25rem] below-1000:w-[18rem] h-[3.4rem] pt-4 mt-3 text-[1rem] below-730:w-[10rem] below-730:text-[0.8rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                            {originalTwoFactorStatus == true ? "Disable" :"Enable"} two Step Verification   
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
                          
                          {showSaveChanges == true && (
                            <button
                              className="p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500"
                              onClick={saveChanges}
                            >
                              <h1 className="font-bold">Save Changes</h1>
                            </button>
                            
                          )}
                           
                        </div>
                        <div className=" mt-4  h-full hidden below-500:flex  ">
                          <div className=" below-500:flex below-500:flex-col">

                          <div className=" below-500:flex">

                          
                          <h3 className=" uppercase w-[25rem] below-1000:w-[18rem] h-[3.4rem] pt-4 mt-3 text-[1rem] below-730:w-[10rem] below-730:text-[0.8rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-500:text-center below-500:pt-2">
                            {originalTwoFactorStatus == true ? "Disable" :"Enable"} two Step Verification   
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
                          </div>
                          
                          <div>

                          
                          {showSaveChanges == true && (
                            <button
                              className="p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500"
                              onClick={saveChanges}
                            >
                              <h1 className="font-bold below-500:text-[0.8rem] uppercase">Save Changes</h1>
                            </button>
                            
                          )}
                          </div>
                           </div>
                        </div>
                        <div></div>
                        <div className=" flex">
                          {personalInformation.emailVerified ? (
                            <div className=" h-[4rem]">
                              <div className="  p-2  ml-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4  bg-green-500">
                                <h1 className=" font-bold">
                                  <div className=" flex">
                                    <Check className=" mr-2" />
                                    <span className=" below-500:text-[0.8rem]">{"Your Email is Verified"}</span>
                                  </div>
                                </h1>
                              </div>
                            </div>
                          ) : (
                            <div className=" h-[4rem]">
                              <button className="  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-500">
                                <h1 className=" font-bold uppercase  below-500:text-[0.8rem]">
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
          <div className="  bg-teal-600 border-2 border-black below-566:w-[18rem] below-500:w-full  mt-5 below-370:w-[16rem] below-370:px-1  ">
            <div className="flex justify-between   h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4  w-full">
                <h1 className=" text-4xl font-bold uppercase below-500:text-[1.5rem]">Your Address </h1>
                <p className=" text-2xl  mt-4 uppercase below-500:text-[1rem]">
                  Upload/update your address here
                </p>
              </div>
            </div>
            <div className="  m-5 mx-10  below-500:mx-1 ">
              <div className=" flex below-1000:flex-col below-1000:items-center">
                <div className=" flex-1  below-1319:w-[10rem] below-1000:w-full">
                  <div className=" mb-8  ">
                    <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-590:w-[15rem] below-590:text-[1.5rem] uppercase below-500:text-[1rem] below-500:w-[12rem] below-500:px-0">
                      Shipping Address
                    </h3>
                  </div>
                  <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                    <input
                      type="text"
                      {...registerField("country")}
                      placeholder="Country"
                      className="w-full p-2  border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                          className="w-full below-500:py-1 below-500:ml-3 below-500:text-[0.8rem] ml-5 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
                    />
                    {errors.street && (
                      <span className=" italic text-red-950  text-[1.1rem]">
                        {errors.street.message}
                      </span>
                    )}
                    <div className="flex">
                      <div className=" flex flex-col w-full ">
                        <input
                          type="text"
                          {...registerField("city")}
                          placeholder="City"
                          className="w-full p-2 border-2 border-black bg-white text-black below-500:py-1 below-500:text-[0.8rem] mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                          className="w-full ml-5 below-500:ml-3 p-2 border-2 border-black bg-white text-black below-500:py-1 below-500:text-[0.8rem] mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4  below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                          className="w-full ml-5 below-500:ml-3 p-2 border-2 border-black bg-white text-black mt-4 below-500:py-1 below-500:text-[0.8rem] flex self-center justify-center border-b-8 border-r-4 focus:outline-none"
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
                        className="w-80 p-2  below-500:p-1 border-2 border-black text-black mt-4 flex self-center  justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500"
                      >
                        <h1 className="font-bold below-500:text-[0.8rem] uppercase">Submit</h1>
                      </button>
                      <button
                        type="button"
                        className="w-80 p-2 below-500:p-1 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500 ml-4"
                        onClick={() => {
                          reset(); // Call the reset method from useForm
                        }}
                      >
                        <h1 className="font-bold below-500:text-[0.8rem] uppercase">Reset</h1>
                      </button>
                    </div>
                  </form>
                </div>

                <div className=" flex-1   below-1000:mt-7 ml-8 below-1000:ml-0">
                  <div className="   mb-8 ">
                    <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-590:w-[15rem] below-590:text-[1.5rem] uppercase below-500:text-[1rem] below-500:w-[10rem]">
                      Saved Address
                    </h3>
                  </div>
                  <div>
                    <div></div>

                    {alladdress.length === 0 && (
                      <div className=" h-[40vh]   text-center">
                        <div className=" flex justify-center ">
                          {" "}
                          <h3 className="w-[25rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500  uppercase below-500:text-[1rem] ">
                            No Address Added Yet
                          </h3>
                        </div>
                      </div>
                    )}

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
          <div className="  bg-teal-600 border-2 border-black   mt-5   ">
            <div className="flex justify-between h-full px-6 py-6  text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold below-1000:text-[2rem] uppercase below-500:text-[1.5rem]">Your Card Details</h1>
                <p className=" text-2xl  mt-4  uppercase below-500:text-[1rem]">
                  Add/Update your Card information here
                </p>
              </div>
            </div>
            <div className=" m-8 below-500:mx-2 flex  justify-between below-1000:flex-col  ">
              <div className="w-[34rem] below-700:w-[30rem] below-730:w-[20rem] flex-1 below-590:w-[18rem]  below-445:w-full  below-500:w-full">
                <form
                  // ref={formRef}
                  onSubmit={handleSubmitPayment(onSubmitPayment)}
                >
                  <div className=" pt-5  ">
                    <h3 className=" w-full text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-500:text-[1.5rem] uppercase">
                      Payment Method
                    </h3>
                    <input
                      type="text"
                      {...registerPayment("cardNumber")}
                      placeholder="Card Number"
                      className="w-full  p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none below-500:text-[0.8rem]"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none below-500:text-[0.8rem]"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none below-500:text-[0.8rem]"
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
                      className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 focus:outline-none below-500:text-[0.8rem]"
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
              <div className=" mr-2 below-600:mr-0 ml-8 below-600:ml-0 flex-1 below-1000:mt-5 ">
                <div className=" pt-5  ">
                  <h3 className="w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 below-695:w-[15rem] below-695:text-[1rem] uppercase below-566:w-[12rem]">
                    Saved Cards
                  </h3>
            

                  <div className="overflow-auto h-[20rem] mt-4 border-2 border-black px-2  flex items-center flex-col below-600:border-none below-600:px-0 ">
                    <div className=" mt-4 ">
                      {AllUserCards.length === 0 && (
                        <div className=" h-[40vh]    text-center">
                          <div className=" flex justify-center ">
                            {" "}
                            <h3 className="w-[30rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500  uppercase">
                              No Cards Added Yet
                            </h3>
                          </div>
                        </div>
                      )}
                      {AllUserCards.map((card) => (
                        <div
                          key={card.id}
                          className="w-[30rem] below-730:w-full below-1265:w-[25rem]  h-[4rem] mt-2 text-[1rem] leading-none p-2 border-2 border-black text-black  border-b-8 border-r-4 bg-yellow-500 "
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
                                  <p className=" below-500:text-[0.8rem] uppercase">{card.cardHolderName}</p>
                                  <div className=" flex ml-4">
                                    <p className="below-500:text-[0.8rem] uppercase">VISA </p>
                                    <p className="below-500:text-[0.8rem] uppercase"> **** {card.lastFourDigits}</p>
                                  </div>
                                </div>
                                <p className="below-500:text-[0.8rem] uppercase">Expires :{card.cardExpiry} </p>
                              </div>
                            </div>
                            <div className=" flex self-center">
                              <DeleteModal 
                              setNewData={setNewCardData}
                              cardID={card.id}  setToastData={setToastData}
 />
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
            <div className="flex justify-between h-full px-6 py-6  below-1265:flex-col text-wrap">
              <div className="  h-full pr-4 ">
                <h1 className=" text-4xl font-bold below-600:text-[2rem] uppercase">Your Wallet Details </h1>
                <p className=" text-2xl  mt-4 below-600:text-[1.5rem] uppercase">
                  See your Wallet related Details Here
                </p>
                <div>
                  <div className=" flex mt-4">
                    <div className=" w-[25rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                      <div className=" p-4 px-4">
                        <h1 className=" text-[2rem] below-600:text-[1.2rem]  uppercase "> Available balance</h1>
                        <h1 className=" mt-4 text-[1.8rem] below-600:text-[1.2rem] uppercase">
                          {formatToINR(walletBalance)}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-5 w-[15rem] below-400:w-[12rem]">
                    <StyledButton buttonName="Add Money" />
                  </div>
                </div>
              </div>

              <div className=" flex-1 below-600:mt-5 ">
                <div className=" flex justify-around below-600:flex-col below-600:items-center ">
                  <div className=" below-600:mb-0   mb-8 ">
                    <button
                      type="button"
                      className={`w-[15rem] below-700:w-[10rem] uppercase p-2 border-2 border-black  mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  ml-4  ${
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
                      className={`w-[15rem] p-2 below-700:w-[10rem] uppercase border-2 border-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 ml-4 ${
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

                <div className=" bg-teal-600 h-[20rem]  w-full border-black border-2  below-500:border-none">
                  {activeTab === "credit" && (
                    <div className=" px-4 mt-2 below-500:px-0   overflow-y-auto">
                      { loading === true  ? (<div className="  h-[10rem]
                       flex items-center justify-center    "><LoadingAnimation/> </div>)
                      :(creditTransaction.length === 0 && (
                        <div className=" h-[40vh]   text-center">
                          <div className=" flex justify-center ">
                            {" "}
                            <h3 className=" w-full text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500  uppercase below-900:text-[1rem] below-730:text-[0.8rem] ">
                              No Transactions Made Yet
                            </h3>
                          </div>
                        </div>
                      ))}
                      {creditTransaction &&
                        creditTransaction.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between border-b-8 border-r-4  bg-white border-black border-2 px-2 mb-2 overflow-y-auto "
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
                                    <h1 className=" text-green-600 below-900:text-[0.8rem] below-730:text-[0.6rem]">Success</h1>
                                  </div>
                                </div>
                                <div>
                                  <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]" >Remarks :{transaction.description}</div>
                                  <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]" >{formatDate(transaction.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                            <div className=" flex flex-col mt-2">
                              <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]">
                                Transaction Id:{transaction?.id}
                              </div>
                              <div className=" text-green-800 below-900:text-[0.8rem] below-730:text-[0.6rem]  ">
                                {formatToINR(transaction.amount)} Credit
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {activeTab === "debit" && (
                    <div className=" px-4 mt-2  below-500:px-0  overflow-y-auto">
                      {debitTransaction.length === 0 && (
                        <div className=" h-[40vh]   text-center">
                          <div className=" flex justify-center ">
                            {" "}
                            <h3 className="w-[30rem] text-[2rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500  uppercase below-900:text-[1rem] below-730:text-[0.8rem]">
                              No Transactions Made Yet
                            </h3>
                          </div>
                        </div>
                      )}
                      {debitTransaction != "" ? (
                        debitTransaction.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between border-b-8 border-r-4  bg-white border-black border-2 px-2  mb-2 overflow-y-auto"
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
                                    <h1 className=" text-green-600 below-900:text-[0.8rem] below-730:text-[0.6rem]">Success</h1>
                                  </div>
                                </div>
                                <div>
                                  <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]">Remarks :{transaction.description}</div>
                                  <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]">{formatDate(transaction.createdAt)}</div>
                                </div>
                              </div>
                            </div>
                            <div className=" flex flex-col mt-2">
                              <div className=" below-900:text-[0.8rem] below-730:text-[0.6rem]  ">
                                Transaction Id:{transaction?.id}
                              </div>
                              <div className=" text-red-800 below-730:text-[0.6rem]  below-900:text-[0.8rem] ">
                                {formatToINR(transaction.amount)} Debit
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className=" h-[40vh]   text-center"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* password update */}
          <div className="  bg-teal-600 border-2 border-black   mt-5  ">
            <div className="flex justify-between h-full px-6 py-6 below-868:flex-col  text-wrap below-500:items-center">
              <div className="  h-full pr-4 mb-5 ">
                <h1 className=" text-4xl font-bold uppercase below-500:text-[2rem]">Update Password </h1>
                <p className=" text-2xl  mt-4 uppercase below-500:text-[1rem]">
                  Enter your Current Password to update it{" "}
                </p>
              </div>
              <form
                action=""
                onSubmit={handleSubmitNewPassword(onSubmitNewPassword)}
              >
                <div className="flex flex-col   border-2 border-black w-[50vw]  h-full  below-445:w-[22rem] below-426:w-full   ">
                  <div className=" flex px-4 py-4 justify-center w-full h-full ">
                    <div className=" w-full">
                      <div className="flex w-full flex-col items-center justify-center">
                        <input
                          type="password"
                          placeholder="Current password"
                          {...NewPasswordField("currentPassword")}
                          className="w-full  p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 below-500:text-[0.8rem]  focus:outline-none "
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
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 below-500:text-[0.8rem]  focus:outline-none "
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
                          className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none   below-500:text-[0.8rem]"
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
                          className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500 mr-4 below-500:text-[0.8rem] below-400:w-[8rem] below-400:text-[0.8rem] uppercase "
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
