import { Card } from "@/lib/cards"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CardProps {
    card: Card
    className?: string | null
}   

const CardFront = ({ card, className }:  CardProps) => {
    return (
    <div className={cn("w-28 h-44 relative -ml-20 shadow border-2 border-gray-700 rounded-xl cursor-pointer duration-100", className)}>
        <Image alt="Card" fill src={card.image} />
    </div>
    )
}

export default CardFront