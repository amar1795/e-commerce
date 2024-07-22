import LoadingAnimation from '@/components/Loading/LoadingAnimation'
import React from 'react'

const loading = () => {
  return (
    <div>
     <div className=" h-screen  flex items-center justify-center">
        <LoadingAnimation />
      </div>
    </div>
  )
}

export default loading
