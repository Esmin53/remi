import Image from "next/image"
import CardBack from "./CardBack"
import { useEffect, useState } from "react"
import { CARDS, Card } from "@/lib/cards"
import CardBundle from "./CardBundle"
import { useSession } from "next-auth/react"

interface TableProps {
    startGame: () => void
    drawCard: () => void
    discardCard: () => void
    lastDiscartedCard: Card | null
    deckLength: number
    getCards: () => void
    handLength: number
    owner: string | undefined
    gameStatus: string | undefined
}

const Table = ({drawCard, discardCard, lastDiscartedCard, startGame, deckLength, getCards, handLength, gameStatus, owner}: TableProps) => {
    let bg = "/table/red.jpg"

    const session = useSession()

    return (
        <div className="w-9/12  max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(${bg})`}}>
            {gameStatus != "IN_PROGRESS" && owner === session.data?.user?.name ? <button className="w-32 h-12 rounded-lg bg-peach cursor-pointer z-40" >
                Start Game
            </button> : <>
            <div className="w-14 sm:w-16 md:w-24 lg:w-28 h-24 sm:h-32 md:h-40 lg:h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative" onClick={() => discardCard()}>
                {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
            </div>
           <div onClick={() => drawCard()}>
            <CardBack />
           </div>
            </>}
            
            {deckLength > 0 && handLength === 0 && <div className="absolute bottom-2" onClick={() => getCards()}>
                <CardBundle />
            </div>}
       </div>
    )
}

export default Table