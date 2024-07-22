import React, { useEffect, useState } from 'react';
import StarComponent from './StarComponent';
import { Angry, Frown, Meh, Smile, Laugh } from 'lucide-react';
import MiniStarComponent from './MiniStarComponent';

const smileys = [
  <Angry key="angry" size={50} fill='red' />,
  <Frown key="frown" size={50} fill='orange'/>,
  <Meh key="meh" size={50} fill="green"/>,
  <Smile key="smile" size={50} fill="pink"/>,
  <Laugh key="laugh" size={50} fill="yellow"/>,
];

const feedbackTexts = ['Terrible', 'Bad', 'Okay', 'Good', 'Awesome'];


const MiniStarRatingComponent = ({ totalStars = 5,setStarRating,reviewStars }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(null);
    const[finalRating,setFinalRating]=useState(6);

     // Use useEffect to update selectedStars and finalRating when reviewStars changes
  useEffect(() => {
    if (reviewStars !== undefined && reviewStars >= 0 && reviewStars <= totalStars) {
      setSelectedStars(reviewStars);
      setFinalRating(reviewStars - 1); // Adjust finalRating accordingly
    }
  }, [reviewStars, totalStars]);

    const handleStarClick = (index) => {
        setSelectedStars(index + 1);
        
        setFinalRating(index);
        // setFinalRating(reviewStars);
        setStarRating(index+1)
        
        // alert(`You've rated this ${index + 1} stars`);
      };


      const getFeedbackText = () => {
        if (finalRating >= 0) {      
          
          const feedbackText = feedbackTexts[finalRating];

          return feedbackText;
        } else {
          return '';
        }
      };
    
  return (
    <div className="flex flex-col items-center ">
      <div className="flex space-x-1">
        {[...Array(totalStars)].map((_, i) => (
          <MiniStarComponent
            key={i}
            index={i}
            finalRating={finalRating}
            reviewStars={reviewStars}
            selected={i < selectedStars}
            onMouseEnter={() => setHoveredStar(i)}
            onMouseLeave={() => setHoveredStar(null)}
            // onClick={() => handleStarClick(i)}
            hoverIndex={hoveredStar}
          />
        ))}
      </div>
      {/* <div className="mt-4">
        {smileys[selectedStars - 1] || smileys[4]} 
      </div>
      <div className="mt-2 text-lg font-semibold text-center h-[1rem]">
        {getFeedbackText()}
      </div> */}
     

    </div>
  );
};

export default MiniStarRatingComponent;
