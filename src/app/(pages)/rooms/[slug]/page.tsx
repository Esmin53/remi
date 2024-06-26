"use client"

import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import GameMenu from "@/components/gamemenu/GameMenu"
import { Card } from "@/lib/cards"
import { pusherClient } from "@/lib/pusher"
import { getCards, toPusherKey } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const page = () => {

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCards, setSelectedCards] = useState<Card[]>([])
    const [startingDeck, setStartingDeck] = useState<Card[]>([])
    const [lastDiscartedCard, setLastDiscartedCard] = useState<Card | null>(null)
    const [cards, setCards] = useState<Card[] >([])

    const key = usePathname().split("/")[2]
    const router = useRouter()

    const startGame = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, {
                method: "POST",
                body: JSON.stringify({
                    key
                })
            })

            const data = await response.json()

        } catch (error) {
            console.log(error)
        }
    }

    const getMyCards = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${key}/hand`)

            const data = await response.json()


            await setCardIds(data.cards)
            await setCards(getCards(data.cards))
            console.log(cards)
            console.log(cardIds)

        } catch (error) {
            console.log(error)
        }
    }

    const selectCard = (card: Card) => {
        if (selectedCards.find(item => item.id === card.id)) {
            setSelectedCards(prevSelected => prevSelected.filter(item => item.id !== card.id));
        } else {
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

    const leaveTable = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`, {
                method: "DELETE"
            });

            const data = await response.json()

            if(data.ok && response.status === 200) {
                router.push("/");
            }

            console.log("Leave table data ---> ", data)
        } catch (error) {
            
        }
    }

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

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`game:${key}:turn`))
        
            const turnHandler = (data: {startingDeck: number[], currentTurn: string}) => {
                setStartingDeck(getCards(data.startingDeck))
            }
    
        pusherClient.bind(`game-turn`, turnHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`game:${key}:turn`))
            pusherClient.unbind('game-turn', turnHandler)
        }
    }, [])

    console.log(startingDeck)

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6 relative justify-evenly">
                <div className="flex-1 w-full flex justify-center items-center relative">
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full top-2"></div>
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full right-8"></div>
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full left-8"></div>
                <Table drawCard={drawAcard} discardCard={discardCard}
                lastDiscartedCard={lastDiscartedCard} startGame={startGame}
                deckLength={startingDeck.length} getCards={getMyCards} handLength={cards.length}/>
                </div>
                {cardIds?.length ? <MyHand 
                    selectedCards={selectedCards}
                    cards={cards} 
                    selectCard={selectCard}/> : null}
                <div className="w-full h-12 bg-[#486581] mt-auto flex items-center justify-center gap-5">
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => leaveTable()}>Leave</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => swapCards()}>Swap</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => drawAcard()}>Draw</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => discardCard()}>Discard</p>
                </div>
            </div>
            <GameMenu />
        </div>
    )
}

export default page