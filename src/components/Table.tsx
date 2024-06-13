import Image from "next/image"
import CardBack from "./CardBack"
import { useEffect, useState } from "react"
import { CARDS, Card } from "@/lib/cards"

interface TableProps {
    drawCard: () => void
    discardCard: () => void
    lastDiscartedCard: Card | null
}

const Table = ({drawCard, discardCard, lastDiscartedCard}: TableProps) => {

    return (
        <div className="w-10/12 aspect-video rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4">
            <div className="w-28 h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative" onClick={() => discardCard()}>
                {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
            </div>
           <div onClick={() => drawCard()}>
            <CardBack />
           </div>
       </div>
    )
}

export default Table