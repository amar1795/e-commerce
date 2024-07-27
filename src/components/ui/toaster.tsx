"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider  >
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="  below-700:w-[20rem] below-700:py-1  border-black border-2 rounded-none border-b-8 border-r-4 ">
            <div className="grid gap-1">
              {title && <ToastTitle className=" text-[1.4rem] below-700:text-[1rem]">{title}</ToastTitle>}
              {description && (
                <ToastDescription className=" text-[5rem]  below-700:text-[0.8rem] ">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
