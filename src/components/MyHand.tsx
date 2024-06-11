import { Card } from "@/lib/cards"
import Image from "next/image"
import CardFront from "./CardFront"

const MyHand = ({cards}: {cards: Card[]}) => {

    return (
        <div className="w-full h-fit  mt-auto flex -gap-20 justify-center my-6 absolute bottom-5">
            {cards.map((item) => <CardFront card={item}/>)}
        </div>
    )
}

export default MyHand