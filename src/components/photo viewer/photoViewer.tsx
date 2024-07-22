"use client"
import React from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type PhotoViewerProps = {
    images: string[];
};

const PhotoViewer = ({ images}: PhotoViewerProps) => {
    
  if (!images) {
    return <div>loading...</div>;
  }
  
  return (
    <div>

    <PhotoProvider  maskOpacity={0.8}>
      <div className="foo flex flex-wrap">
        {images?.map((item, index) => (
          <PhotoView key={index} src={item?.url} >
            <div className='border-2 border-black overflow-hidden'>

            <img src={item?.url} alt="" className=' h-[30rem] w-[22rem] object-cover  px-2 py-6 transform transition-transform duration-300 hover:scale-110 '  />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
      
    </div>
  )
}

export default PhotoViewer
