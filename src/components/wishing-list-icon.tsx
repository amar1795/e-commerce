import React from "react";
import { Heart } from "lucide-react";

const WishingListIcon = ({ mensCollectionData }) => {
  return (
    <div>
      <div className=" pr-3 relative ">
        <Heart fill="black" className=" below-400:w-4 below-400:h-4 w-7 h-7" />
        {mensCollectionData[0]?.totalWishlistCount > 0 && (
          <span
            className=" font-mono bg-white w-5 h-5 rounded-full absolute top-0 left-5 below-400:left-4
                        below-400:w-4 below-400:h-4 below-400:text-[0.6rem] below-400:pt-[1px]"
          >
            {mensCollectionData[0]?.totalWishlistCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default WishingListIcon;
