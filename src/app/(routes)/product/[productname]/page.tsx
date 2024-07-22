import React from 'react'

const page = ({ params }: { params: { productname: string } }) => {
  return (
    <div>
      <h1>
        This is the product page for {params.productname} 
      </h1>
    </div>
  )
}

export default page
