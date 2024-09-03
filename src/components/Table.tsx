import Image from "next/image"
import CardBack from "./CardBack"
import { useEffect, useState } from "react"
import { CARDS, Card } from "@/lib/cards"
import CardBundle from "./CardBundle"
import { useSession } from "next-auth/react"

interface TableProps {
    color?: string
}

const Table = ({color}: TableProps) => {
    let bg = color || localStorage.getItem("table") || "/table/green.jpg"


    return (
        <div className="w-10/12  max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4 cursor-pointer" style={{backgroundImage: `url(${bg})`}}>

       </div>
    )
}

export default Table