import { Card } from "@/lib/cards"
import CardFront from "./CardFront"
import { cn, getCards } from "@/lib/utils"
import { useEffect, useState } from "react"

interface HandProps {

    selectedCards: Card[]
    selectCard: (card: Card) => void
    cards: Card[]
}

const MyHand = ({selectedCards, selectCard, cards}: HandProps) => {


    return (
        <div className="w-full h-fit  mt-auto flex -gap-20 justify-center my-6 flex-shrink-0">
            {cards.map((item, index) => <div key={item.id} className={cn("hover:-my-4 duration-100")} onClick={() =>  selectCard(item)}>
                <CardFront card={item} 
                className={selectedCards.find((sc) => item.id === sc.id ) ? "border-red-500 -my-4 shadow-red-glow" : null}/>
            </div>)}
        </div>
    )
}

export default MyHand