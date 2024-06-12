import { Card } from "@/lib/cards"
import Image from "next/image"
import CardFront from "./CardFront"
import { cn, getCards } from "@/lib/utils"
import { useEffect, useState } from "react"

interface HandProps {
    cardIds: number[]
    selectedCard: number | null
    selectCard: (cardid: number) => void
}

const MyHand = ({cardIds, selectedCard, selectCard}: HandProps) => {
    const [cards, setCards] = useState<Card[]>([])

    useEffect(() => {
        setCards(getCards(cardIds))
    }, [cardIds])

    

    return (
        <div className="w-full h-fit  mt-auto flex -gap-20 justify-center my-6 absolute bottom-5">
            {cards.map((item) => <div key={item.id} className={cn("hover:-my-4", {
                "-my-4": item.id === selectedCard
            })} onClick={() => selectCard(item.id)}>
                <CardFront card={item} />
            </div>)}
        </div>
    )
}

export default MyHand