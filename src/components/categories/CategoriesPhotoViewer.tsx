import React from 'react'
import PhotoViewer from '../photo viewer/photoViewer'


type imagesProp = {
    images: string[];
};

const CategoriesPhotoViewer = ({images}:imagesProp) => {
  return (
    <div>
       <div>
                <div className="">
                  <PhotoViewer images={images} />
                </div>
              </div>
    </div>
  )
}

export default CategoriesPhotoViewer
