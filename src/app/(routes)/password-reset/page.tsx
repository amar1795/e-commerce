"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { newPassword } from "@/actions/email/password-creation";
import { useSearchParams } from "next/navigation";

const page = () => {
  const { toast } = useToast();
  const [showToast, setShowToast] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // toast is not working inside the modal need to check

  // console.log("this is callback url", callbackUrl);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) {
            reset();
            setError(data.error);

            // setModalErrorToast(data.error);
          }

          if (data?.success) {
            reset();

            setSuccess(data.success);
            // toast({
            //   title: "Password reset link sent!",
            //   description:
            //     "Password rest link has been sent to your email address. Please check your email to reset your password.",
            // });
            // setTimeout(() => {
            //   router.push('/password-reset'); // Replace with your target page URL
            // }, 2000); // 2000 milliseconds = 2 seconds
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  useEffect(() => {
    if (error) {
      // alert(error);
      toast({
        title: `${error}`,
        variant: "destructive",
        description:
          "Please request a new password reset link. The link you are using is invalid or has expired.",
      });
    }
    if (success) {
      // alert(success);
      toast({
        title: `${success}`,
        description:
          "You have successfully reset your password! You will be redirected to the login page within 5 seconds.",
      });
    }
  }, [error, success]);

  const handleClick = () => {
    setShowToast(false);
    setTimeout(() => {
      setShowToast(true);
    }, 2000); // 2-second delay
  };

  useEffect(() => {
    if (success) {
      // toast({
      //   title: "Password has been reset successfully!",
      //   description:
      //     "You will be redirected to the login page within 5 seconds",
      // });
      setTimeout(() => {
        router.push("/login");
      }, 4000);

      // Reset the showToast state to prevent repeated toasts
      setShowToast(false);
    }
  }, [success]);

  return (
    <div className=" overflow-hidden border-2 border-black">
      <div className=" flex h-screen w-full ">
        <div className=" bg-pink-500 flex-1  flex items-center justify-center w-full border-2 border-black">
      <div className="  w-[50vw]  below-600:w-[70vw]">

          <div className=" w-full flex flex-col  pt-[8rem] h-[30rem] ">
            <h1 className="text-4xl font-bold text-center  mt-4 mb-4 uppercase">
              Create your new password
            </h1>
            <form
              action="
            "
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="password"
                placeholder="Password"
                {...registerField("password")}
                className=" w-full mt-4 mb-4 p-2 border-2 border-black bg-white text-black  flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
              />
              {errors.password && (
                <span className=" italic text-red-950  text-[1.1rem]">
                  {errors.password.message}
                </span>
              )}
              <input
                type="password"
                placeholder="Confirm Password"
                {...registerField("confirmpassword")}
                className="w-full p-2 border-2 mb-4 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
              />
              {errors.confirmpassword && (
                <span className=" italic text-red-950  text-[1.1rem]">
                  {errors.confirmpassword.message}
                </span>
              )}

              <div className=" h-[4rem]">
                <button
                  type="submit"
                  className="w-[15rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-yellow-400"
                  onClick={handleClick}
                >
                  <h1 className=" font-bold"> Create New Password </h1>
                </button>
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
