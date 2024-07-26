import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const UserCustomButton = ({buttonName}:{buttonName:string}) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useCurrentUser();
  const router = useRouter();
  const { data: session, status } = useSession();


  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
    }
};

// useEffect(() => {
//   if (status === "authenticated") {
//     signOut({ redirect: false });
//   } else if (status === "unauthenticated") {
//     router.push("/");
//   }
// }, [ status]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: String) => {
    // console.log(`You clicked ${option}`);
    setIsOpen(false);

    switch(option) {
      case 'Settings':
        router.push('/account-settings');
        break;
      case 'OrderHistory':
        router.push('/orders');
        break;
      case 'Wishlist':
        router.push('/wishlist');
        break;
      default:
        break;
    }
  };


  const initiateLogout = async () => {
  
    signOut({ redirect: true, callbackUrl: '/'});
    // await logout();
    // window.location.href = '/';

    setIsOpen(false);

    // router.push('/');
  };

  return (
    <div className="h-[4rem] relative" ref={dropdownRef}>
      <button
        className="w-[10rem] below-400:w-[6rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
        onClick={handleButtonClick}
      >
        <h1 className="font-bold below-400:text-[0.8rem]">{buttonName}</h1>
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-[10rem] below-400:w-[6rem] bg-white border border-black  text-black z-10">
          <ul>
            
            <li onClick={() => handleOptionClick('Settings')} className="p-2 hover:bg-gray-200 cursor-pointer flex justify-center below-400:text-[0.8rem]">Settings</li>
            <li onClick={() => handleOptionClick('OrderHistory')} className="p-2 hover:bg-gray-200 cursor-pointer flex justify-center below-400:text-[0.8rem] below-400:pl-5 ">Order History</li>
            <li onClick={() => handleOptionClick('Wishlist')} className="p-2 hover:bg-gray-200 cursor-pointer flex justify-center below-400:text-[0.8rem]">Wishlist</li>
             <li onClick={() =>  initiateLogout()} className="p-2 hover:bg-gray-200 cursor-pointer flex justify-center font-bold text-red-800 below-400:text-[0.8rem]">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserCustomButton;
