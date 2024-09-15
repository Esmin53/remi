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
        <div className="w-full flex items-start justify-center absolute -bottom-20 sm:-bottom-28 md:-bottom-36">
            <div className="w-fit h-fit flex justify-center flex-shrink-0 ml-7 sm:ml-10 md:ml-16 lg:ml-20">
            {cards.map((item, index) => <div key={item.id} className={cn("hover:-my-4 duration-100")} onClick={() =>  selectCard(item)}>
                <CardFront card={item} 
                className={selectedCards.find((sc) => item.id === sc.id ) ? "border-red-500 -my-4 shadow-red-glow" : null}/>
            </div>)}
            </div>
        </div>
    )
}

export default MyHand