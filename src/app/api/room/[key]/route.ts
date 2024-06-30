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

        return new NextResponse(JSON.stringify(roomData || null), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}