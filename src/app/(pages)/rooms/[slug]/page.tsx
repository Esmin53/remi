"use client"

import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import GameMenu from "@/components/gamemenu/GameMenu"
import { CARDS, Card } from "@/lib/cards"
import { useEffect, useState } from "react"


const page = () => {

    const [startingHand, setStartingHand] = useState<Card[]>([])

    const getStartingHand = () => {
        let tempArray: Card[] = []
        for(let i = 0; i < 15; i++) {
            tempArray.push(CARDS[i])
        }
    
        setStartingHand(tempArray)
    }

    console.log(startingHand)

    useEffect(() => {
        getStartingHand()
    }, [])

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6">
                <Table />
                {startingHand.length ? <MyHand cards={startingHand}/> : null}
            </div>
            <GameMenu />
        </div>
    )
}

export default page