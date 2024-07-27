import Image from 'next/image'
import React from 'react'

const CustomUserAvatar = ({src}) => {
  return (
    <div>
    <div className="w-24 h-24  below-695:h-16 below-695:w-16  border border-gray-300 rounded-lg overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt="Avatar"
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 below-695:text-[0.8rem] below-695:pl-4">
          Your Image
        </div>
      )}
    </div>
  

    </div>
  )
}

export default CustomUserAvatar
