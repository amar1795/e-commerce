"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function CustomToast() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Password has been reset Successfully! ",
          description: "You will be redierecetd to the login page within 5 seconds",
        })
      }}
    >
      Show Toast
    </Button>

    
  )
}
