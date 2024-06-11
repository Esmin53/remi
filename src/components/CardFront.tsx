import { Card } from "@/lib/cards"
import Image from "next/image"

interface CardProps {
    card: Card
}   

const CardFront = ({ card }:  CardProps) => {
    return (
    <div className="w-28 h-44 relative -ml-20 shadow border-2 border-gray-700 rounded-xl cursor-pointer hover:-my-4 duration-100">
        <Image alt="Card" fill src={card.image} />
    </div>
    )
}

export default CardFront