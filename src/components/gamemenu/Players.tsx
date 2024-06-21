""

import { users } from "@/db/schema"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"


const Players = () => {
    const [players, setPlayers] = useState<{id: string, username: string}[]>([])

    const key = usePathname().split("/")[2]

    const getPlayers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`)

            const data = await response.json()
            
            setPlayers(data.players)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getPlayers()
    }, [])
    return (
        <div className="w-full flex p-2 gap-2 bg-lightblue rounded shadow-sm items-center justify-between min-h-16">
        { players.map((item) => <div className="w-14 h-14 rounded-full bg-paleblue relative flex items-center justify-center"
         key={item.id}>
            <p className="text-xs font-medium text-gray-900">{item.username}</p>
        </div>)}
    </div>
    )
}

export default Players