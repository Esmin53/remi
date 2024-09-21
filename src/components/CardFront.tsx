import { Card } from "@/lib/cards"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CardProps {
    card: Card
    className?: string | null
}   

const CardFront = ({ card, className }:  CardProps) => {
    return (
    <div className={cn("w-[3.1rem] h-[4.4rem] sm:w-[4.6rem] md:w-[7.04rem] lg:w-32 sm:h-32 md:h-40 lg:h-44 relative -ml-9 sm:-ml-12 md:-ml-20 lg:-ml-24 shadow-sm sm:shadow border sm:border-2 border-gray-700 bg-[#4d4d4d] rounded-sm sm:rounded-lg md:rounded-xl cursor-pointer duration-100", className)}>
        <Image alt="Card" fill src={card.image} className="object-fill" quality={100}/>
    </div>
    )
}

export default CardFront