import { meld } from "@/db/schema";
import { allUniqueSymbols, cn, getCards } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { Card } from "@/lib/cards";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

type Meld = typeof meld.$inferSelect;

interface MeldAreaProps {
    className?: string,
    melds: Meld[],
    gameId: string | null,
    selectedCards: Card[],
    getNewCards: (selectedCard: number) => void,
    isFetching: boolean
}

const MeldArea = ({melds, className, gameId, selectedCards, getNewCards, isFetching}: MeldAreaProps) => {
    const [showAllMelds, setShowAllMelds] = useState(false)
    const [isMelding, setIsMelding] = useState(false)
    
    const key = usePathname().split("/")[2]
    
    let cards = melds.map((item) => {
        return {
            cards: getCards(item.cards!),
            meld: item
        
        }
    })

    const addToMeld = async (meldId: number, cards: Card[]) => {
        if(isMelding || isFetching) return
        setIsMelding(prev => false)
        try {
            console.log(meldId, gameId, "KEY: ", key)
            if(allUniqueSymbols(cards)) {
                if(cards.every(card => {
                    if(card.value === selectedCards[0].value && card.symbol !== selectedCards[0].symbol) {
                        return true
                    } else {
                        return false
                    }
                })) {

                    let cardIds = cards.map((item) => item.id)
                    let selectedCard = selectedCards[0].id

                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${gameId}/meld`, {
                        method: "PUT",
                        body: JSON.stringify({
                            cards: [...cardIds, selectedCards[0].id],
                            gameId: gameId,
                            meldId: meldId,
                            key: key,
                            selectedCard: selectedCards[0].id
                        })
                    })

                    const data = await response.json()

                    console.log("data", data)
                    getNewCards(selectedCard)
                    setIsMelding(prev => false)
                }
            } else {
                let tempArray = cards
                if(cards[0].symbol !== selectedCards[0].symbol) return
                
                if(parseInt(cards[0].value) - parseInt(selectedCards[0].value) === 1) {
                    tempArray.unshift(selectedCards[0])
                } else if (parseInt(selectedCards[0].value) - parseInt(cards[cards.length - 1].value) === 1) {
                    tempArray.push(selectedCards[0])
                } else {
                    return
                }

                let cardIds = tempArray.map((item) => item.id)
                let selectedCard = selectedCards[0].id

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${gameId}/meld`, {
                    method: "PUT",
                    body: JSON.stringify({
                        cards: cardIds,
                        gameId: gameId,
                        meldId: meldId,
                        key: key,
                        selectedCard: selectedCards[0].id
                    })
                })

                const data = await response.json()

                console.log("data", data)
                getNewCards(selectedCard)
                setIsMelding(prev => false) 

            }

        } catch (error) {
            setIsMelding(prev => false)
            console.log(error)
        }
    }

    return (
        <div>
            {isMelding ? <div className="absolute w-12 h-12 top-6 left-2 animate-bounce">
                <div className="relative w-full h-full">
                    <Image fill alt="Cards icon" src='/cards.png'/>
                </div>
            </div> : null}
            {showAllMelds ? <div className="absolute w-full h-full left-0 top-0 z-40 flex flex-wrap items-start justify-start gap-6 p-4 bg-gray-400 bg-opacity-85">
                <div className="w-12 h-12 bg-gray-300 rounded-full shadow-sm absolute right-2 top-2 flex items-center justify-center cursor-pointer" onClick={() => setShowAllMelds(false)} >
                    <ChevronUp className="w-9 h-9" />
                </div>
                {cards?.map((item) => {
                    return <div className="flex" onClick={() => addToMeld(item.meld.id, item.cards)}>
                        {item.cards.map((item) => <div className={cn("-ml-2 w-12 h-24 lg:w-20 lg:h-36 rounded-md relative overflow-hidden shadow border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100}/>
                </div>)}
                    </div>
                })}
            
            </div> : null}
            <div className={cn("flex items-center justify-evenly cursor-pointer overflow-hidden", className)} onClick={() => setShowAllMelds(true)}>
            <div className="flex cursor-pointer">
             {cards[0]?.cards && cards[0]?.cards.map((item) => {
                return <div className={cn("-ml-2 w-12 h-24 lg:w-16 lg:h-28 rounded-md relative overflow-hidden shadow border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100}/>
                </div>
             })}
            </div>
            <div className="flex cursor-pointer ">
             {cards[1]?.cards && cards[1]?.cards.map((item) => {
                return <div className={cn("-ml-2 w-12 h-24 lg:w-16 lg:h-28 rounded-md relative overflow-hidden shadow border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100}/>
                </div>
             })}
            </div>
            { cards.length > 2 ? <div className="text-gray-900 text-3xl font-semibold z-40 absolute right-4">+{cards.length - 2}</div> : null}
        </div>
        </div>

    )
}

export default MeldArea