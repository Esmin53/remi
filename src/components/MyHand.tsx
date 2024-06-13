import { Card } from "@/lib/cards"
import CardFront from "./CardFront"
import { cn, getCards } from "@/lib/utils"
import { useEffect, useState } from "react"

interface HandProps {

    selectedCards: Card | null
    selectCard: (card: Card) => void
    cards: Card[]
}

const MyHand = ({selectedCards, selectCard, cards}: HandProps) => {


    return (
        <div className="w-full h-fit  mt-auto flex -gap-20 justify-center my-6 absolute bottom-5">
            {cards.map((item, index) => <div key={item.id} className={cn("hover:-my-4 duration-100", {
                "-my-4": item.id === selectedCards?.id
            })} onClick={() =>  selectCard(item)}>
                <CardFront card={item} 
                className={item?.id === selectedCards?.id ? "border-red-500 -my-4 shadow-red-glow" : null}/>
            </div>)}
        </div>
    )
}

export default MyHand