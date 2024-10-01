import Image from "next/image"
import CardBack from "./CardBack"
import { useEffect, useState } from "react"
import { CARDS, Card } from "@/lib/cards"
import CardBundle from "./CardBundle"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

interface TableProps {
    color?: string
    className?: string
}

const Table = ({color, className}: TableProps) => {
    let bg = color || "green.jpg"


    return (
        <div className={cn("w-7/12 max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center justify-center gap-4 cursor-pointer", className, {
            "border-red-500 border-2": true
        })} style={{backgroundImage: `url(/table/${bg})`}}>

       </div>
    )
}

export default Table