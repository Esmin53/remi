import { games, rooms } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const GET = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user) return new NextResponse(JSON.stringify("Unauthorized!"), { status: 401 });
    
        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]
    
        const [roomData] = await db.select({
            owner: rooms.ownerName,
            gameId: games.id,
            gameStatus: games.gameStatus,
            deck: games.deck,
            currentTurn: games.currentTurn
        }).from(rooms).fullJoin(games, eq(rooms.key, games.roomKey)).where(and(
            eq(rooms.key, key),
        )).orderBy(rooms.createdAt)

        let data: {
            owner: string | null,
            gameId: number | null,
            gameStatus: string | null,
            currentTurn: string | null,
            deck: number | null
        } = {
            owner: roomData.owner,
            gameId: roomData.gameId,
            gameStatus: roomData.gameStatus,
            currentTurn: roomData.currentTurn,
            deck: null
        }

        if(roomData.deck) data.deck = roomData.deck[roomData.deck.length - 1]

        return new NextResponse(JSON.stringify(data || null), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}