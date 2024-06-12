"use client"

import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import GameMenu from "@/components/gamemenu/GameMenu"
import { useEffect, useState } from "react"


const page = () => {

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCard, setSelectedCard] = useState<number | null>(81)
    const [startingDeck, setStartingDeck] = useState<number[]>([])
    const [lastDiscartedCard, setLastDiscartedCard] = useState<number | null>(null)


    const startGame = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`)

            const data = await response.json()

            setCardIds(data.playerOne)
            setStartingDeck(data.startingDeck)
        } catch (error) {
            console.log(error)
        }
    }

    const selectCard = (cardId: number) => {
        if(cardId === selectedCard) {
            setSelectedCard(null)
        } else {
            setSelectedCard(cardId)
        }
    }

    const drawAcard = () => {
        if(cardIds.length >= 15) {
            return
        }

        let newCard = startingDeck.pop()
        if(typeof newCard === 'number') {
            setCardIds([...cardIds, newCard])
        }
    }

    const discardCard = () => {
        if(selectedCard === null || cardIds.length === 14) {
            return
        }
        startingDeck.unshift(selectedCard)
        setCardIds(cardIds.filter(id => id !== selectedCard))
        setLastDiscartedCard(selectedCard)
        setSelectedCard(null)  
    }

    useEffect(() => {
        startGame()
    }, [])

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6">
                <Table drawCard={drawAcard} discardCard={discardCard}
                lastDiscartedCard={lastDiscartedCard}
                />
                {cardIds?.length ? <MyHand 
                    cardIds={cardIds} 
                    selectedCard={selectedCard} 
                    selectCard={selectCard}/> : <p>Loading</p>}
            </div>
            <GameMenu />
        </div>
    )
}

export default page