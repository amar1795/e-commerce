import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "./ui/button"
const CategoriesDropdown = () => {

  return (
    <div className=" outline-none px-4">


      <DropdownMenu>
    <DropdownMenuTrigger>
      
           <Button>
        <div className=" font-mono">
        All
        </div>
  <DropdownMenuContent>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
     

</Button>
   
    </DropdownMenuTrigger>
    </DropdownMenu>
    </div>
  )
}

export default CategoriesDropdown
