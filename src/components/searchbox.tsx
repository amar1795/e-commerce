import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
  } from "lucide-react"
  
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
  
  export function SearchBox() {
    return (
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder=" search..." />
        <CommandList>
          
        </CommandList>
      </Command>
    )
  }
  