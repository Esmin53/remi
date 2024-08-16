import { meld } from "@/db/schema";
import { cn, getCards } from "@/lib/utils";
import CardFront from "./CardFront";
import { useEffect } from "react";
import Image from "next/image";

type Meld = typeof meld.$inferSelect;

interface MeldAreaProps {
    className?: string,
    melds: Meld[]
}

const MeldArea = ({melds, className}: MeldAreaProps) => {
    

    let cards = melds.map((item) => {
        return getCards(item.cards!)
    })

    return (
        <div className={cn("flex items-center justify-evenly relative", className)}>
            <div className="flex">
             {cards[0] && cards[0].map((item) => {
                return <div className={cn("-ml-2 w-12 h-24 lg:w-16 lg:h-28 rounded-md relative overflow-hidden shadow border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100}/>
                </div>
             })}
            </div>
            <div className="flex ">
             {cards[1] && cards[1].map((item) => {
                return <div className={cn("-ml-2 w-12 h-24 lg:w-16 lg:h-28 rounded-md relative overflow-hidden shadow border-2 border-gray-700")}>
                    <Image fill alt={item.label} src={item.image} quality={100}/>
                </div>
             })}
            </div>
            { cards.length > 2 ? <div className="text-gray-900 text-3xl font-semibold z-40 absolute -right-2">+{cards.length - 2}</div> : null}
        </div>
    )
}

export default MeldArea