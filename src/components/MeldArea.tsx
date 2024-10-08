import { meld } from "@/db/schema";
import { canIAddToThisMeld, cn, getCards } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/lib/cards";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Meld = typeof meld.$inferSelect;

interface MeldAreaProps {
    className?: string,
    melds: Meld[],
    gameId: string | null,
    selectedCards: Card[],
    getNewCards: (selectedCard: number) => void,
    isFetching: boolean,
    setIsFetching: (value: boolean) => void
    deck: string
}

const MeldArea = ({melds, className, gameId, selectedCards, getNewCards, isFetching, setIsFetching, deck}: MeldAreaProps) => {
    const [showAllMelds, setShowAllMelds] = useState(false)
    
    const key = usePathname().split("/")[2]
    const {toast} = useToast()
    
    let cards = melds.map((item) => {
        return {
            cards: getCards(item.cards!),
            meld: item
        
        }
    })


    const addToMeld = async (meldId: number, cards: Card[]) => {
        if(isFetching || selectedCards.length !== 1) return
        setIsFetching(true)
        
        let tempArray = canIAddToThisMeld({cards, selectedCard: selectedCards[0]})

        if(!tempArray) {
            setIsFetching(false)
            return
        }

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${gameId}/meld`, {
                        method: "PUT",
                        body: JSON.stringify({
                            cards: tempArray.map((item) => item.id),
                            gameId: gameId,
                            meldId: meldId,
                            key: key,
                            selectedCard: selectedCards[0].id
                        })
                    })
    
                    if(response.ok) {
                        getNewCards(selectedCards[0].id)
                    }
    
                } catch {
                    toast({
                        title: "Something went wrong!",
                        description: "An unexpected error has occured, please check your internet connection or refreshing the browser.",
                        variant: "destructive"
                    })
                } finally {
                    setIsFetching(false)
                }
            }



    return (
        <div>
            {showAllMelds ? <div className="absolute w-full h-full left-0 top-0 z-40 flex flex-wrap items-start justify-start gap-x-4 sm:gap-x-6 p-2 sm:p-4 bg-gray-400 bg-opacity-85 overflow-y-auto">
                <div className="h-7 w-7 sm:w-12 sm:h-12 bg-gray-300/70 rounded-full shadow-sm absolute right-1.5 sm:right-2 top-1.5 sm:top-2 flex items-center justify-center cursor-pointer z-[80]" onClick={() => setShowAllMelds(false)} >
                    <ChevronUp className="w-6 sm:w-9 h-6 sm:h-9" />
                </div>
                {cards?.map((item) => {
                    return <div key={item.meld.id} className="flex z-[70] cursor-pointer pl-5 " onClick={() => addToMeld(item.meld.id, item.cards)} >
                        {item.cards.map((item) => <div key={item.id} className={cn("-ml-5 sm:-ml-2 w-[3.52rem] h-[5rem] sm:w-[4.93rem] sm:h-28 lg:w-[5.63rem] lg:h-32 rounded-sm sm:rounded-md relative overflow-hidden shadow-sm sm:shadow border sm:border-2", {
            "border-gray-700 bg-[#4d4d4d]": deck === "black",
            "border-gray-300 bg-[#ffffff]": deck === "white"
                        })}>
                    <Image fill alt={item.label} src={`/cards/${deck}/${item.image}`} quality={100} className="object-center"/>
                </div>)}
                    </div>
                })}
            
            </div> : null}
            <div className={cn("flex items-center justify-evenly cursor-pointer overflow-hidden gap-3", className)} onClick={() => setShowAllMelds(true)}>
            <div className="flex cursor-pointer items-center">
             {cards[0]?.cards && cards[0]?.cards.map((item) => {
                return <div key={item.id} className={cn("-ml-3 w-[2.64rem] h-[3.75rem] sm:w-[2.8rem] sm:h-16 md:h-24 md:w-[4.2rem] lg:w-[4.93rem] lg:h-28 rounded-sm md:rounded-md relative overflow-hidden shadow-sm md:shadow border sm:border-2", {
                "border-gray-700 bg-[#4d4d4d]": deck === "black",
                "border-gray-300 bg-[#ffffff]": deck === "white"
                })}>
                    <Image fill alt={item.label} src={`/cards/${deck}/${item.image}`} quality={100} className="object-center"/>
                </div>
             })}
             { cards.length > 1 ? <div className="text-gray-900 text-lg font-medium z-40 absolute right-3 sm:hidden ">+{cards.length - 1}</div> : null}
            </div>
            <div className="hidden sm:flex cursor-pointer ">
             {cards[1]?.cards && cards[1]?.cards.map((item) => {
                return <div key={item.id} className={cn("-ml-2 w-[2.64rem] h-[3.75rem] sm:w-[2.8rem] sm:h-16 md:h-24 md:w-[4.2rem] lg:w-[4.93rem] lg:h-28 rounded-sm md:rounded-md relative overflow-hidden shadow-sm md:shadow border sm:border-2", {
                    "border-gray-700 bg-[#4d4d4d]": deck === "black",
                "border-gray-300 bg-[#ffffff]": deck === "white"
                })}>
                    <Image fill alt={item.label} src={`/cards/${deck}/${item.image}`} quality={100} className="object-center"/>
                </div>
             })}
            </div>
            { cards.length > 2 ? <div className="text-gray-900 text-3xl font-semibold z-40 absolute right-4">+{cards.length - 2}</div> : null}
        </div>
        </div>

    )
}

export default MeldArea