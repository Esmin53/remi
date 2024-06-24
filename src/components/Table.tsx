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
    let bg = "/table/red.jpg"

    return (
        <div className="w-9/12  max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(${bg})`}}>
            <div className="w-14 sm:w-16 md:w-24 lg:w-28 h-24 sm:h-32 md:h-40 lg:h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative" onClick={() => discardCard()}>
                {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
            </div>
           <div onClick={() => drawCard()}>
            <CardBack />
           </div>
       </div>
    )
}

export default Table