import { Steps } from 'rsuite';
import 'rsuite/Steps/styles/index.css';

import React from 'react'

const StepProgress = (orderedDate) => {
  // description={orderedDate}
  // alert(orderedDate)
  // console.log("this is the ordered date", orderedDate)

  return (
    <div>
       <Steps current={0} >
    <Steps.Item title="Order Confirmed"   description={orderedDate?.orderedDate} />
    <Steps.Item title="order Packed"  />
    <Steps.Item title="Order Dispatched"/>
    <Steps.Item title="Delivered"  />
  </Steps>
    </div>
  )
}

export default StepProgress
