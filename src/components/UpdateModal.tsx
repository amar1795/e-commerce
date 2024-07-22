import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EmailUpdateSchema, NameUpdateSchema, ResetSchema } from "@/schemas";
import { Reset } from "@/actions/email/reset-password";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { UpdateName } from "@/actions/update User Settings/updateName";
import { UpdateEmail } from "@/actions/update User Settings/updateEmail";

export function UpdateModal({
  buttonName,
  inputData,
  data,
  setNewData,
  setToastData
}: {
  buttonName: string;
  inputData: string;
}) {

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [Modalerror, setModalError] = useState<string | undefined>("");
  const [Modalsuccess, setModalSuccess] = useState<string | undefined>("");


  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [email, setEmail] = useState(data?.email || '');

  const {
    register: Namefield,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof NameUpdateSchema>>({
    resolver: zodResolver(NameUpdateSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });


  const {
    register: emailField,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors},
    reset: resetEmail,
  } = useForm<z.infer<typeof EmailUpdateSchema>>({
    resolver: zodResolver(EmailUpdateSchema),
    defaultValues: {
      email: "",
  
    },
  });


  const onSubmitEmail = (values: z.infer<typeof EmailUpdateSchema>) => {
    setModalError("");
    setModalSuccess("");

    startTransition(() => {
      UpdateEmail(values.email)
        .then((data) => {
          if (data?.error) {
            resetEmail();
            setModalError(data.error);
            // alert(data.error);
            setToastData({
              variant: "destructive",
              title: data.error,
              description: "Please try again later",
            })
            // setModalErrorToast(data.error);
          }

          
      

          if (data?.success) {
            resetEmail();
            setToastData({
              title: "Email",
              description: "Successfully Updated the Email",
            })
            // alert("Email Updated");

            // alert("Password reset link sent! Password rest link has been sent to your email address. Please check your email to reset your password.");
            setModalSuccess(data.success);
            
          }
        })
        .catch(() => setModalError("Something went wrong"));
    });
    handleModalClose();

  };



  const onSubmit = (values: z.infer<typeof NameUpdateSchema>) => {
    setModalError("");
    setModalSuccess("");

    startTransition(() => {
      UpdateName(values)
        .then((data) => {
          if (data?.error) {
            reset();
            setModalError(data.error);
            setToastData({
              variant: "destructive",
              title: data.error,
              description: "Please try again later",
            })
            // setModalErrorToast(data.error);
          }

          if (data?.success) {
            reset();
            // alert("Password reset link sent! Password rest link has been sent to your email address. Please check your email to reset your password.");
            setModalSuccess(data.success);
            setToastData({
              title: data.success,
              description: "Successfully Updated the Name",
            })
            
          }
        })
        .catch(() => setModalError("Something went wrong"));
    });
    handleModalClose();

  };


  const handleModalClose = () => {
    setIsOpen(false);
    setModalError("");
    setModalSuccess("");
    // setSelectedFiles([]); // Clear selected files state
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
          handleModalClose();
        }
      }}
    >
      <div>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
          <button className="  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 ml-2  bg-green-500">
            <h1 className=" font-bold">{buttonName} </h1>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[445px] h-[20rem]">
        <form onSubmit={inputData === "email" ? handleSubmitEmail(onSubmitEmail) : handleSubmit(onSubmit)}>


            <DialogHeader className=" mt-4">

              { inputData === "email" ? (
                <div>
            <DialogTitle>
                <input
                  type="email"           
                  // value={data?.email}
                  {...emailField("email")}
                  placeholder={data?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                />
                {emailErrors.email && ( <p className="text-red-500">{emailErrors.email.message}</p>)}
              </DialogTitle>
            </div>
              ):(
                <div>
             <DialogTitle>
                <input
                  type="text"
                  {...Namefield("firstname")}
                  placeholder={data?.firstName}
                  // value={data?.firstName}
                  onChange={(e) => setFirstName(e.target.value)}

                  className=" w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none  mr-8"
                />
              </DialogTitle>

              <DialogTitle>
                <input
                  type="text"
                  {...Namefield("lastname")}
                  // value={data?.lastName}
                  
                  onChange={(e) => setLastName(e.target.value)}

                  placeholder={data?.lastName}
                  className=" w-full p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                />
              </DialogTitle>
             </div>
              )}
             

            
            </DialogHeader>

            <DialogFooter>
              <div className=" flex self-center">
                <button
                  type="submit"
                  className="w-[12rem] h-[3rem]  p-2 border-2 border-black text-black mt-8 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-yellow-400"
                >
                  <h1 className=" font-bold">Submit </h1>
                </button>
              </div>
              {/* <button
                type="submit"
                className="w-[12rem] h-[3rem]  p-2 border-2 border-black text-black mt-16 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-600"
              >
                <h1 className=" font-bold">No </h1>
              </button> */}
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}
