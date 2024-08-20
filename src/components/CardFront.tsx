import { Card } from "@/lib/cards"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CardProps {
    card: Card
    className?: string | null
}   

const CardFront = ({ card, className }:  CardProps) => {
    return (
    <div className={cn("w-12 sm:w-16 md:w-24 lg:w-28 h-24 sm:h-32 md:h-40 lg:h-44 relative -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20 shadow border-2 border-gray-700 bg-[#4d4d4d] rounded-xl cursor-pointer duration-100", className)}>
        <Image alt="Card" fill src={card.image} />
    </div>
    )
}

export default CardFront