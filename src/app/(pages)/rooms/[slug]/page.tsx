"use client"

import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import GameMenu from "@/components/gamemenu/GameMenu"
import { Card } from "@/lib/cards"
import { getCards } from "@/lib/utils"
import { Recycle, SortAsc } from "lucide-react"
import { useEffect, useState } from "react"


const page = () => {

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCards, setSelectedCards] = useState<Card | null>(null)
    const [startingDeck, setStartingDeck] = useState<Card[]>([])
    const [lastDiscartedCard, setLastDiscartedCard] = useState<Card | null>(null)
    const [sortingMode, setSortingMode] = useState<boolean >(true)
    const [cards, setCards] = useState<Card[] >([])

    const startGame = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`)

            const data = await response.json()

            setCardIds(data.playerOne)
            setStartingDeck(getCards(data.startingDeck))
            setCards(getCards(data.playerOne))
        } catch (error) {
            console.log(error)
        }
    }

    const selectCard = (cardId: Card) => {
        let previousCard = selectedCards || null;
        
        if(cardId.id === selectedCards?.id) {
            setSelectedCards(null)
            return
        } else {
            setSelectedCards(cardId)
        }

    }

    const drawAcard = () => {
        if(cards.length >= 15) {
            return
        }

        let newCard = startingDeck.pop()

        if(typeof newCard !== 'undefined')
        setCards([...cards, newCard])
            
        
    }

    const discardCard = () => {
        if(selectedCards === null || cards.length === 14) {
            return
        }
        startingDeck.unshift(selectedCards)
        setLastDiscartedCard(selectedCards)
        setCards(cards.filter(item => item.id !== selectedCards.id))
        setSelectedCards(null)  
    }

    useEffect(() => {
        startGame()
    }, [])

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6 relative">
                <div className="w-8 h-8 bg-peach rounded-full absolute top-2 right-2 cursor-pointer flex items-center justify-center"
                onClick={() => setSortingMode(prev => !prev)}>
                   <Recycle />
                </div>
                <Table drawCard={drawAcard} discardCard={discardCard}
                lastDiscartedCard={lastDiscartedCard}
                />
                {cardIds?.length ? <MyHand 
                    selectedCards={selectedCards}
                    cards={cards} 
                    selectCard={selectCard}/> : <p>Loading</p>}
            </div>
            <GameMenu />
        </div>
    )
}

export default page