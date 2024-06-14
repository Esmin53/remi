"use client"

import CardBack from "@/components/CardBack"
import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import GameMenu from "@/components/gamemenu/GameMenu"
import { Card } from "@/lib/cards"
import { getCards } from "@/lib/utils"
import { Recycle, SortAsc } from "lucide-react"
import { useEffect, useState } from "react"


const page = () => {

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCards, setSelectedCards] = useState<Card[]>([])
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

    const selectCard = (card: Card) => {
        if (selectedCards.find(item => item.id === card.id)) {
            // If the card is already selected, deselect it
            setSelectedCards(prevSelected => prevSelected.filter(item => item.id !== card.id));
        } else {
            // Otherwise, select the card
            setSelectedCards(prevSelected => [...prevSelected, card]);
        }
    };

    const drawAcard = () => {
        if(cards.length >= 15) {
            return
        }

        let newCard = startingDeck.pop()

        if(typeof newCard !== 'undefined')
        setCards([...cards, newCard])
            
        
    }

    const discardCard = () => {
        if(selectedCards.length > 1) {
            return
        }

        if(!selectedCards.length || cards.length === 14) {
            return
        }
        startingDeck.unshift(selectedCards[0])
        setLastDiscartedCard(selectedCards[0])
        setCards(cards.filter(item => item.id !== selectedCards[0].id))
        setSelectedCards(selectedCards.filter((item => item.id !== selectedCards[0].id)))  
    }

    useEffect(() => {
        startGame()
    }, [])

    const swapCards = () => {
        if (selectedCards.length > 2 || selectedCards.length < 1) {
             return
        }

        if(!cards[0]?.id || !cards[1]?.id) return
        const index1 = cards.findIndex(card => card.id === selectedCards[0].id);
        const index2 = cards.findIndex(card => card.id === selectedCards[1].id);

        if (index1 === -1 || index2 === -1) {
            console.error('One or both cards not found in the array');
            return;
        }

        const newCards = [...cards];

        [newCards[index1], newCards[index2]] = [newCards[index2], newCards[index1]];

        setCards(newCards);
        setSelectedCards(selectedCards.filter((item => item.id !== selectedCards[0].id)))

    }

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6 relative">
                <Table drawCard={drawAcard} discardCard={discardCard}
                lastDiscartedCard={lastDiscartedCard}
                />
                {cardIds?.length ? <MyHand 
                    selectedCards={selectedCards}
                    cards={cards} 
                    selectCard={selectCard}/> : <CardBack />}
                <div className="w-full h-12 bg-[#486581] mt-auto flex items-center justify-center">
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => swapCards()}>Swap</p>
                </div>
            </div>
            <GameMenu />
        </div>
    )
}

export default page