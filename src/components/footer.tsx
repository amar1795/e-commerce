import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MainFooter = () => {
  
  type SiteData = {
    [key: string]: string[];
  };

  const siteData:SiteData = {
    products: ["Men", "Women", "Kids"],
    collection: ["New Arrival", "Best Seller"],
    info: ["About Us", "Press", "Wishlist", "Contact Us"],
    support: ["Store Locator", "Size Chart", "FAQs", "Delivery", "Returns and Refunds"],
    follows: ["Facebook", "Instagram", "Twitter", "Pinterest", "TikTok", "YouTube"]
  };

  const getLink = (item: string) => {
    switch (item) {
      case 'About Us':
        return '/about-us';
      case 'Contact Us':
        return '/contact-us';
      case 'Wishlist':
        return '/wishlist';
      case 'Men':
        return '/categories/men';
      case 'Women':
        return '/categories/women';
      case 'Kids':
        return '/categories/kids';
      
      default:
        return '#';
    }
  };

  return (
    <div className="bg-black text-white py-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.keys(siteData).map((key) => (
          <div key={key} className="flex flex-col">
            <h1 className="font-bold mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</h1>
            {siteData[key].map((item, index) => (
               <Link href={getLink(item)} key={index} passHref>
              <button key={index} className="text-left mb-1 hover:text-gray-300 focus:outline-none">
                {item}
              </button>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className=' grid grid-cols-3 px-8 pt-4 bg-slate-950 below-730:flex  below-730:flex-col below-730:items-center '>
        <div className='below-730:py-2'>
       <p>&copy;PurchasePal {new Date().getFullYear()}.All rights reserved</p>
        </div>
        <button className='below-730:py-2'>
          Privacy Policy | Terms of Conditions
        </button>
        <div  className=' flex justify-end below-730:py-2'>
          <Image src="/1.jpg" width={30} height={20}  alt="Logo" className=' below-925:h-[2rem] below-925:w-[2rem] h-10 w-[3rem] rounded-md mr-2' />
          <Image src="/2.jpg" width={30} height={20}  alt="Logo" className=' below-925:h-[2rem] below-925:w-[2rem] h-10 w-[3rem] rounded-md mr-2' />
          <Image src="/3.jpg" width={30} height={20}  alt="Logo" className=' below-925:h-[2rem] below-925:w-[2rem] h-10 w-[3rem] rounded-md mr-2' />
          <Image src="/4.png" width={30} height={20}  alt="Logo" className=' below-925:h-[2rem] below-925:w-[2rem] h-10 w-[3rem] rounded-md mr-2' />
          <Image src="/5.jpg" width={30} height={20}  alt="Logo" className=' below-925:h-[2rem] below-925:w-[2rem] h-10 w-[3rem] rounded-md mr-2' />
        </div>

      </div>
    </div>
  );
}

export default MainFooter;
