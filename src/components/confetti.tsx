import React, { useRef, useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import  Confetti  from 'react-confetti'


export const ConfettiComponent = () => {
    const confettiRef = useRef<HTMLCanvasElement>(null)
    const [peices, setPeices] = useState(200)

    setTimeout(() => {
        setPeices(0)
    }, 2000);

        // const { width, height } = useWindowSize()
        
        return (
            <Confetti
        ref={confettiRef}
            width={1500}
            height= {800}
            tweenDuration={100}
            numberOfPieces={peices}
            confettiSource ={{x: 0, y: 500, h:0}}
            initialVelocityX ={20}
            // onConfettiComplete = {() => console.log("Confetti Completed")}
            />)
            
}


