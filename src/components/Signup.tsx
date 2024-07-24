import React, { use, useEffect } from "react";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { register } from "@/actions/register";

interface SignupProps {
  toggleView: () => void;
  setIsSignup: (value: boolean) => void;
}
const Signup: React.FC<SignupProps> = ({ toggleView, setIsSignup }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  // console.log(error, success);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    mode: "onBlur", // Validate on blur
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    // alert(values.email);

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
    if (success) {
      setIsSignup(false);
    }
  }, [error, success, setIsSignup]);

  return (
    <div>
      <div className=" mt-8">
        <h1 className="text-4xl font-bold text-center ">
          Get Started with Us !
        </h1>
        <h1 className="text-4xl font-bold text-center">
          Create Your Free Account
        </h1>

        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center">
            <div className=" flex ">
              <div>
                <input
                  type="text"
                  {...registerField("firstname")}
                  // name="firstname"
                  placeholder="First Name"
                  className=" w-64 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none  mr-8"
                />
                {errors.firstname && (
                  <span className=" italic text-red-950  text-[1.1rem]">
                    {errors.firstname.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...registerField("lastname")}
                  // name="lastname"
                  placeholder="lastname"
                  className="w-64 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                />
                {errors.lastname && (
                  <span className=" italic text-red-950  text-[1.1rem]">
                    {errors.lastname.message}
                  </span>
                )}
              </div>
            </div>
            <input
              type="text"
              // name="email"
              {...registerField("email")}
              placeholder="Email"
              className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
            />
            {errors.email && (
              <span className=" italic text-red-950  text-[1.1rem]">
                {errors.email.message}
              </span>
            )}

            <input
              type="password"
              // name="password"
              {...registerField("password")}
              placeholder="Password"
              className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
            />
            <div className=" px-5 ml-4 mt-2">
              {errors.password && (
                <span className=" italic text-red-950  text-[1.1rem]">
                  {errors.password.message}
                </span>
              )}
            </div>

            <input
              type="password"
              {...registerField("confirmpassword")}
              placeholder="Confirm Password"
              className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
            />
            {errors.confirmpassword && (
              <span className=" italic text-red-950  text-[1.1rem]">
                {errors.confirmpassword.message}
              </span>
            )}

            <div className=" h-[4rem] ">
              <button
                type="submit"
                className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-500 "
              >
                <h1 className=" font-bold">Create Account </h1>
              </button>
            </div>
          </div>
        </form>

        <div className=" text-center pb-7">
          <p className=" mx-[5rem] mt-4">
            Already have an Account ?{" "}
            <button className=" font-bold text-2xl" onClick={toggleView}>
              Login{" "}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
