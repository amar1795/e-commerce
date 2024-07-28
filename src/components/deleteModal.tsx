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
import { ResetSchema } from "@/schemas";
import { Reset } from "@/actions/email/reset-password";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { deleteSecureCard } from "@/actions/payments/handlePayment";

export function DeleteModal({ buttonName,cardID,setToastData,setNewData }: { buttonName: string }) {
  const { toast } = useToast();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [Modalerror, setModalError] = useState<string | undefined>("");
  const [Modalsuccess, setModalSuccess] = useState<string | undefined>("");


  // toast is not working inside the modal need to check

  // console.log("this is callback url", callbackUrl);

  const onSubmit = () => {
    setModalError("");
    setModalSuccess("");
    handleModalClose();
    
    // startTransition(() => {
    //   Reset(values)
    //     .then((data) => {
    //       if (data?.error) {
    //         reset();
    //         setModalError(data.error);

    //         // setModalErrorToast(data.error);
    //       }

    //       if (data?.success) {
    //         reset();
    //         // alert("Password reset link sent! Password rest link has been sent to your email address. Please check your email to reset your password.");
    //         setModalSuccess(data.success);
    //         // toast({
    //         //   title: "Password reset link sent!",
    //         //   description:
    //         //     "Password rest link has been sent to your email address. Please check your email to reset your password.",
    //         // });
    //         // setTimeout(() => {
    //         //   router.push('/password-reset'); // Replace with your target page URL
    //         // }, 2000); // 2000 milliseconds = 2 seconds
    //       }
    //     })
    //     .catch(() => setModalError("Something went wrong"));
    // });
    

  };

  const deleteCard = async(e) => {
    e.preventDefault();
   await deleteSecureCard(cardID);
   handleModalClose(e);
    setToastData({
      title: "Card Deleted",
      description: "Successfully Deleted the Card",
    })
  }

  const handleModalClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setModalError("");
    setModalSuccess("");
    setNewData(prev => !prev);

 
  };


  useEffect(() => {
    if (Modalerror) {
      // alert(error);
      toast({
        title: `${Modalerror}`,
        description:
          "Password rest link has been sent to your email address. Please check your email to reset your password.",
      });
    }
    if (Modalsuccess) {
      // alert(success);
      toast({
        title: `${Modalsuccess}`,
        description:
          "Password rest link has been sent to your email address. Please check your email to reset your password.",
      });
    }
  }, [Modalerror, Modalsuccess]);

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
          <button className="">
            <h1 className=" font-bold"><Trash2 className=" below-700:w-4 below-700:h-4 w-8 h-8" strokeWidth={1.5}  /> </h1>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[445px] h-[20rem]">
          <form action="" >
            <DialogHeader>
              <DialogTitle>
                <h1 className="w-[full]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400">
                  <h1 className=" font-bold">Would you Like to Delete the Card </h1>
                  
                </h1>
              </DialogTitle>
         
              <DialogTitle>
                <h1 className="w-[full]  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4   bg-yellow-400">
                  <h1 className=" font-bold">Please confirm</h1>
                  
                </h1>
              </DialogTitle>
         
            </DialogHeader>
            
            
         
            <DialogFooter>
            
              <button
                onClick={handleModalClose}

                className="w-[12rem] h-[3rem]  p-2 border-2 border-black text-black mt-16 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-600"
              >
                <h1 className=" font-bold">No </h1>
              </button>
              <button
                type="submit"
                onClick={deleteCard}
                className="w-[12rem] h-[3rem]  p-2 border-2 border-black text-black mt-16 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-red-600"
              >
                <h1 className=" font-bold" >Yes </h1>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}
