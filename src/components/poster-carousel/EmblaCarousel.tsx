"use client";

import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { getAllPosters } from "@/actions/posterAction";
import Link from "next/link";
const URL = `${process.env.MAIN_DOMAIN}/api/posters`;

type Poster = {
  label: string;
  imageUrl: string;
};

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  posterData: Poster[];
};

// const basicfunction = async()=>{
//   const imageData = await getAllPosters();
//   return imageData;

// }

// const imageData = basicfunction();
// console.log("this is the image data", imageData)

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, posterData } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <section className="embla ">
      <div className="embla__viewport  border-4 border-black" ref={emblaRef}>
        <div className="embla__container ">
          {posterData
            .filter((_, index) => [0, 1, 2, 4].includes(index))
            .map((poster, index) => (
              <div className="embla__slide  " key={index}>
                <Link
                  href={`${process.env.MAIN_DOMAIN}/categories/${
                    poster.label.endsWith("s")
                      ? poster.label
                      : poster.label + "s"
                  }`}
                >
                  <div className="embla__slide__number  ">
                    <div className="relative">
                      <Image
                        src={poster.imageUrl}
                        alt={poster.label}
                        height={900}
                        width={1500}
                        layout="responsive"
                        objectFit="fill"
                        className="rounded-lg"
                      />
                      <div className="absolute w-full h-full bottom-4 left-0 text-white bg-black bg-opacity-40 px-4 py-2 rounded z-10">
                        {/* {poster.label} */}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

          {/* {slides.map((index) => (
            <div className="embla__slide  bg-red-400  " key={index}>
              <div className="embla__slide__number ">
                <Image
                  src="/images/1.jpg"
                  alt="Picture of the author"
                 fill="cover" 
                />
                {index+1}
              </div>
            </div>
          ))} */}
        </div>
      </div>

      <div className="embla__controls">
        {/* <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
