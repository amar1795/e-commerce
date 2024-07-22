"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { UpdateAvatar } from "@/actions/update User Settings/UpdatUserAvatar";

// Define the validation schema using zod
const registerCircleSchemaClient = z.object({
  circle_image: z.string().url("Invalid image URL").nonempty("Photo is required."),
});

// Define the type for form input
type RegisterCircleInputClient = { circle_image: string };

export default function UploadImage({fetchUpdatedImage}) {
  const [preview, setPreview] = useState("");

  // Initialize the form using react-hook-form and zod
  const form = useForm<RegisterCircleInputClient>({
    mode: "onSubmit",
    resolver: zodResolver(registerCircleSchemaClient),
  });

  function submitCircleRegistration(value: RegisterCircleInputClient) {
    UpdateAvatar(value.circle_image);
    console.log("Image uploaded successfully", value.circle_image);
   
    fetchUpdatedImage();
    // alert("Image uploaded successfully: " + value.circle_image);
  }

  // Custom avatar component with square box and image inside
   const CustomAvatar = ({ src }: { src: string }) => (
    <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt="Avatar"
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          Your Image
        </div>
      )}
    </div>
  );

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-8"
          onSubmit={form.handleSubmit(submitCircleRegistration)}
        >
          <CustomAvatar src={preview} />
          <FormField
            control={form.control}
            name="circle_image"
            render={({ field: { onChange, value, ...rest } }) => (
              <>
                <FormItem>
                  <FormControl>
                    {/* Added CldUploadWidget to handle image upload */}
                    <CldUploadWidget
                      uploadPreset="mjsgvhim"
                      onUpload={(result) => {
                        const url = result.info.secure_url;
                        setPreview(url); // Update the preview with the uploaded image URL
                        onChange(url); // Set the form value with the uploaded image URL
                      }}
                    >
                      {({ open }) => {
                        return (
                          <>
                            {/* Added a button to trigger Cloudinary upload */}
                            <Button type="button" onClick={open}>
                              Upload Image
                            </Button>
                            <Input
                              type="text"
                              {...rest}
                              value={value || ""}
                              style={{ display: "none" }} // Hide the input field
                            />
                          </>
                        );
                      }}
                    </CldUploadWidget>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="h-[4rem]">
            <button
              type="submit"
              className="w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-pink-500"
            >
              <h1 className="font-bold">Save</h1>
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}
