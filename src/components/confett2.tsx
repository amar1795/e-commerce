import React, { useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import  Confetti  from 'react-confetti'

export const ConfettiComponent2 = () => {
    // const { width, height } = useWindowSize()
    const [peices, setPeices] = useState(200)

    setTimeout(() => {
        setPeices(0)
    }, 2000);

    
    return (
        <Confetti
        width={1500}
        height= {800}
        tweenDuration={100}
        numberOfPieces={peices}
        confettiSource ={{x: 1500, y: 500, h:0}}
        initialVelocityX ={20}
        // onConfettiComplete = {() => console.log("Confetti Completed")}
        />)
        
}
