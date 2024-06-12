import Image from "next/image"
import CardBack from "./CardBack"
import { useEffect, useState } from "react"
import { CARDS, Card } from "@/lib/cards"

interface TableProps {
    drawCard: () => void
    discardCard: () => void
    lastDiscartedCard: number | null
}

const Table = ({drawCard, discardCard, lastDiscartedCard}: TableProps) => {
    const [card, setCard] = useState<Card | null>(null)

    useEffect(() => {
        if(lastDiscartedCard === null) {
            return
        }
        let temp = CARDS.filter(item => item.id === lastDiscartedCard)
        setCard(temp[0])
    }, [lastDiscartedCard])

    return (
        <div className="w-10/12 aspect-video rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4">
            <div className="w-28 h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative" onClick={() => discardCard()}>
                {card?.image ? <Image alt="Card" fill src={card.image} /> : null}
            </div>
           <div onClick={() => drawCard()}>
            <CardBack />
           </div>
       </div>
    )
}

export default Table