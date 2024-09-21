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
            {showAllMelds ? <div className="absolute w-full h-full left-0 top-0 z-40 flex flex-wrap items-start justify-start gap-x-4 sm:gap-x-6 p-2 sm:p-4 bg-gray-400 bg-opacity-85 overflow-y-auto">
                <div className="h-7 w-7 sm:w-12 sm:h-12 bg-gray-300/70 rounded-full shadow-sm absolute right-1.5 sm:right-2 top-1.5 sm:top-2 flex items-center justify-center cursor-pointer z-50" onClick={() => setShowAllMelds(false)} >
                    <ChevronUp className="w-6 sm:w-9 h-6 sm:h-9" />
                </div>
                {cards?.map((item) => {
                    return <div className="flex z-[70] cursor-pointer pl-5 " onClick={() => addToMeld(item.meld.id, item.cards)} >
                        {item.cards.map((item) => <div className={cn("-ml-5 sm:-ml-2 w-[3.52rem] h-[5rem] sm:w-[4.93rem] sm:h-28 lg:w-[5.63rem] lg:h-32 rounded-sm sm:rounded-md relative overflow-hidden bg-[#4d4d4d] shadow-sm sm:shadow border sm:border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100} className="object-center"/>
                </div>)}
                    </div>
                })}
            
            </div> : null}
            <div className={cn("flex items-center justify-evenly cursor-pointer overflow-hidden gap-3", className)} onClick={() => setShowAllMelds(true)}>
            <div className="flex cursor-pointer items-center">
             {cards[0]?.cards && cards[0]?.cards.map((item) => {
                return <div className={cn("-ml-3 w-[2.64rem] h-[3.75rem] sm:w-[4.23rem] sm:h-24 lg:w-[4.93rem] lg:h-28 bg-[#4d4d4d] rounded-sm sm:rounded-md relative overflow-hidden shadow-sm sm:shadow border sm:border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100} className="object-center"/>
                </div>
             })}
             { cards.length > 1 ? <div className="text-gray-900 text-lg font-medium z-40 absolute right-3 sm:hidden ">+{cards.length - 1}</div> : null}
            </div>
            <div className="hidden sm:flex cursor-pointer ">
             {cards[1]?.cards && cards[1]?.cards.map((item) => {
                return <div className={cn("-ml-2 w-[2.64rem] h-[3.75rem] sm:w-[4.23rem] sm:h-24 lg:w-[4.93rem] lg:h-28 rounded-sm sm:rounded-md bg-[#4d4d4d] relative overflow-hidden shadow-sm sm:shadow border sm:border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100} className="object-center"/>
                </div>
             })}
            </div>
            { cards.length > 2 ? <div className="text-gray-900 text-3xl font-semibold z-40 absolute right-4">+{cards.length - 2}</div> : null}
        </div>
        </div>

    )
}

export default MeldArea