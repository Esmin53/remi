import { Card } from "@/lib/cards"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

interface CardProps {
    card: Card
    className?: string | null
}   

const CardFront = ({ card, className }:  CardProps) => {
    const [currentDeck, setCurrentDeck] = useState("black")

    useEffect(() => {
        typeof window !== "undefined" &&  setCurrentDeck(localStorage.getItem("deck") || "black")
    }, []) 

    return (
    <div className={cn("w-[1.76rem] h-10 sm:w-[4.6rem] md:w-[7.04rem] lg:w-32 sm:h-32 md:h-40 lg:h-44 relative -ml-4 sm:-ml-12 md:-ml-20 lg:-ml-24 shadow-sm sm:shadow border sm:border-2 rounded-sm sm:rounded-lg md:rounded-xl cursor-pointer duration-100", {
        "border-gray-700 bg-[#4d4d4d]": currentDeck === "black",
        "border-gray-300 bg-[#ffffff]": currentDeck === "white"
    }, className)}>
        <Image alt="Card" fill src={`/cards/${currentDeck}/${card.image}`} className="object-fill" quality={100}/>
    </div>
    )
}

export default CardFront