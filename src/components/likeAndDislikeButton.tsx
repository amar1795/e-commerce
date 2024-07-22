import { useCurrentUser } from "@/hooks/use-current-user";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

const LikeAndDislikeButton = ({
  handlelike,
  handleDislike,
  review,
  callToast,
}) => {
  const [like, setLike] = useState(review?.likedByUser);
  const [dislike, setDislike] = useState(review?.dislikedByUser);
  const [totalLikes, setTotalLikes] = useState(review?.totalLikes);
  const [totalDislikes, setTotalDislikes] = useState(review?.totalDislikes);
  console.log("this is the review data for the like and dislike button:", review);
  const user = useCurrentUser();

  // const debouncedLikeDislikeLogic = debounce(likeDislikeLogic, 2000);

  const handlelikeFunc = async (reviewId) => {
    if(!user)
      {
        return callToast({
          variant: "destructive",
          title: `Please login to like the review`,
          description: "You are not logged in to like the review",
        });

      }
    // const response = await productLike(reviewId);
    if (like == true) {
      setLike(false);
      // setDislike(true);
      setTotalLikes(totalLikes - 1);

      callToast({
        variant: "destructive",
        title: `Liked removed from the review`,
        description: "You have succesfully removed liked from the review",
      });
    } else {
      setLike(true);
      setDislike(false);
      setTotalLikes(totalLikes + 1);
      setTotalDislikes(dislike ? totalDislikes - 1 : totalDislikes);
      callToast({
        title: `You have  liked the review`,
        description: "You have succesfully liked the review",
      });

    }
    handlelike(reviewId);
  };

  const handleDislikeFunc = async (reviewId) => {
    if(!user)
      {
        return callToast({
          variant: "destructive",
          title: `Please login to dislike the review`,
          description: "You are not logged in to dislike the review",
        });
      }

    if (dislike == true) {
      // setLike(false);
      setDislike(false);
      setTotalDislikes(totalDislikes - 1);
      callToast({
        variant: "destructive",
        title: `disliked removed from the review`,
        description: "You have succesfully removed disliked from the review",
      });
    } else {
      setLike(false);
      setDislike(true);
      setTotalDislikes(totalDislikes + 1);
      setTotalLikes(like ? totalLikes - 1 : totalLikes);

      callToast({
        variant: "destructive",
        title: `You disliked the review`,
        description: "You have succesfully disliked the review",
      });

    }
    handleDislike(reviewId);
  };
  return (
    <div>
      <div>
        <div className=" bg-white border-2 border-black flex px-2 py-1 w-[8rem] h-full self-center justify-between ">
          <div className=" flex ">
            <button onClick={() => handlelikeFunc(review?.id)}>
              <div className=" self-center">
                <ThumbsUp
                  size={20}
                  // fill={`${review?.likedByUser == true ? "green" : "white"}`}
                  fill={`${like == true ? "green" : "white"}`}
                  strokeWidth={0.5}
                />
              </div>
            </button>
            {/* <p className=" pl-1  text-[12px] mt-1  ">{review?.totalLikes}</p> */}
            <p className=" pl-1  text-[12px] mt-1  ">{totalLikes}</p>
          </div>

          <div className=" flex">
            <button onClick={() => handleDislikeFunc(review?.id)}>
              <div className=" self-center">
                <ThumbsDown
                  size={20}
                  // fill={`${review?.dislikedByUser == true ? "red" : "white"}`}
                  fill={`${dislike == true ? "red" : "white"}`}
                  strokeWidth={0.5}
                />{" "}
              </div>
            </button>
            <p className=" pl-1  text-[12px] mt-1  ">{totalDislikes}</p>
            {/* <p className=" pl-1  text-[12px] mt-1  ">{review?.totalDislikes}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeAndDislikeButton;
