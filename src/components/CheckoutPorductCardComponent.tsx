import React from 'react'
import CheckoutProductCard from './checkout product card/checkoutProductCard'

const CheckoutPorductCardComponent = ({productData}) => {

  
  return (
    <div>
      <div className=" px-4 py-4 mt-2 w-[40rem] flex-1 ">
            {
                productData.map((product)=>{
                    return(
                    <div className=' mb-4'>
                        <CheckoutProductCard product={product} />
                    </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default CheckoutPorductCardComponent
