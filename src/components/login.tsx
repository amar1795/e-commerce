"use client";
import Image from "next/image";
import React, {
  startTransition,
  useEffect,
  useState,
  useTransition,
} from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomModal } from "./Custommodal";
interface LoginProps {
  toggleView: () => void;
}
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import ButtonSpinner from "./button spinner/ButtonSpinner";
import { signIn } from "next-auth/react";

const Login: React.FC<LoginProps> = ({ toggleView }) => {
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const calltwoFactor = async () => {
    toast({
      title: "2 Factor Token Sent to your Email",
      description: "Please check your email for the 2 Factor Token",
    });
  };

  // console.log("this is callback url", callbackUrl);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            // reset();
            setError(data.error);
          }

          if (data?.success) {
            reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            calltwoFactor();
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  useEffect(() => {
    if (error) {
      // alert(error);
    }
    if (success) {
      // alert(success);
    }
  }, [error, success]);

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/",
    });
  }

  return (
    <div>
      <div className=" mt-8">
        <h1 className="text-4xl font-bold text-center ">
          Welcome To Purchase Pal!
        </h1>
        {error && (
          <span className=" italic text-red-950  text-[1.5rem]">{error}</span>
        )}
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Email"
              {...registerField("email")}
              className="w-96 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
            />
            {errors.email && (
              <span className=" italic text-red-950  text-[1.1rem]">
                {errors.email.message}
              </span>
            )}
            <input
              {...registerField("password")}
              type="password"
              placeholder="Password"
              className="w-96 p-2  border-2 border-black bg-white text-black flex self-center justify-center border-b-8 border-r-4  focus:outline-none mt-4"
            />
            {errors.password && (
              <span className=" italic text-red-950  text-[1.1rem]">
                {errors.password.message}
              </span>
            )}

            {showTwoFactor && (
              <input
                {...registerField("code")}
                type="text"
                placeholder="Enter 2FA code"
                className="w-96 p-2  border-2 border-black bg-white text-black flex self-center justify-center border-b-8 border-r-4  focus:outline-none mt-4"
              />
            )}
            {errors.password && (
              <span className=" italic text-red-950  text-[1.1rem]">
                {errors.password.message}
              </span>
            )}

            <div className=" h-[4rem]">
              <button
                type="submit"
                disabled={isPending}
                className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
              >
                <h1 className=" font-bold">
                  {" "}
                  {isPending
                    ? <div > <ButtonSpinner/></div>
                    : showTwoFactor
                    ? "Confirm"
                    : "Login"}
                </h1>
                {/* {isPending && <span className="ml-2">Loading...</span>} */}
              </button>
            </div>
          </div>
        </form>
        <div className=" mt-4 flex justify-center ">
          <p className=" self-center pr-4 text-1xl font-bold">
            Forgot your Password ?
          </p>
          <div className=" h-[4rem]">
            <CustomModal buttonName="click here" />
          </div>
        </div>
        <div className=" text-center">
          <p className=" mx-[5rem] mt-4">
            Don't have an account ?{" "}
            <button onClick={toggleView} className=" font-bold text-2xl">
              Sign Up
            </button>
          </p>
        </div>

        <div className=" flex justify-center mt-4">
          <div className=" border-2 border-gray-600 w-[10rem] h-0 self-center mr-5"></div>
          Or
          <div className=" border-2 border-gray-600  w-[10rem] h-0 ml-5 self-center"></div>
        </div>
        <div className=" flex justify-center">
          <button className="w-80 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2"   onClick={() => onClick("google")}>
            <Image
              src="/google.png"
              width={20}
              height={20}
              alt="Logo"
              className=" rounded-full mr-2 "
            />
            <h1 className="">Login with Google</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
