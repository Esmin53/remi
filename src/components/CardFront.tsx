import { Card } from "@/lib/cards"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

interface CardProps {
    card: Card
    className?: string | null,
    deck?: string
}   

const CardFront = ({ card, className, deck }:  CardProps) => {

    return (
    <div className={cn("w-[2.6rem] h-[3.5rem] sm:w-[4.2rem] sm:h-24 md:w-[7.04rem] lg:w-32  md:h-40 lg:h-44 relative -ml-7 sm:-ml-12 md:-ml-20 lg:-ml-24 shadow-sm md:shadow border sm:border-2 rounded-sm sm:rounded-lg lg:rounded-xl cursor-pointer duration-100", {
        "border-gray-700 bg-[#4d4d4d]": deck === "black",
        "border-gray-300 bg-[#ffffff]": deck === "white"
    }, className)}>
        <Image alt="Card" fill src={`/cards/${deck}/${card.image}`} className="object-fill" quality={100}/>
    </div>
    )
}

export default CardFront