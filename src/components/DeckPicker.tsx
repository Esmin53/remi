"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

const DeckPicker = () => {

    const [currentDeck, setCurrentDeck] = useState("black")

    useEffect(() => {
        typeof window !== "undefined" &&  setCurrentDeck(localStorage.getItem("deck") || "black")
    }, []) 

    return (
            <div className="flex gap-2">
                <div className={cn("w-[4.6rem] md:w-[7.04rem] h-32 md:h-40  relative shadow-sm sm:shadow border sm:border-2 border-gray-700 bg-[#4d4d4d] rounded-sm sm:rounded-lg md:rounded-xl cursor-pointer duration-100", {
                    "border-red-500": currentDeck === "black"
                })} onClick={() => {
                    setCurrentDeck("black")
                    localStorage.setItem("deck", "black")
                }}>
                    <Image alt="Card" fill src={`/cards/black/Clovers_A.png`} className="object-fill" quality={100}/>
                </div>
                <div className={cn("w-[4.6rem] md:w-[7.04rem] h-32 md:h-40  relative shadow-sm sm:shadow border sm:border-2 border-gray-200 bg-[#4d4d4d] rounded-sm sm:rounded-lg md:rounded-xl cursor-pointer duration-100", {
                    "border-red-500": currentDeck === "white"
                })} onClick={() => {
                    setCurrentDeck("white")
                    localStorage.setItem("deck", "white")
                }}>
                    <Image alt="Card" fill src={`/cards/white/Clovers_A.png`} className="object-fill" quality={100}/>
                </div>
            </div>

    )
}

export default DeckPicker