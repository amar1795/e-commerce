"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import notfound from '../../video/pulp-fiction-john-travolta-ezgif.com-video-to-gif-converter.gif';
// import ConfettiComponent from '@/components/confetti';

const NotFound = () => {
  return (
    <div className="flex-1 relative h-screen">
        {/* <ConfettiComponent /> */}
      <div className="relative w-full h-full">
        <Image
          src={notfound}
          alt="Not Found"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="h-[4rem] absolute top-[5rem] right-[4rem] transform -translate-x-1/2 z-10">
        <Link href="/">
          <button className="w-80 p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500">
            <h1 className="font-bold">Go to HomePage</h1>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
