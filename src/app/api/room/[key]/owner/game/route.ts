import { games, rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const PUT = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || !session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized!"}), { status: 401 })
        }

        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]

        const { searchParams } = new URL(req.url);
        const gameId = searchParams.get('gameId') as string;
        const gameStatus = searchParams.get('gameStatus')

        const room = await db.select({
            key: rooms.key,
            owner: rooms.ownerName
        }).from(rooms).where(eq(rooms.key, key))

        if(!room.length) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }
        if(room[0].owner !== session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized"}), { status: 401 })
        }

        if(gameStatus == 'IN_PROGRESS') {
            await db.update(games).set({
                gameStatus: "INTERRUPTED",
                currentTurn: null,
                deck: [],
                message: "Game was interrupted by the room owner!"
            }).where(eq(games.id, parseInt(gameId)))

        await pusherServer.trigger(
            toPusherKey(`game:${key}:turn`), 
            'game-turn', 
            {
                gameStatus: "INTERRUPTED",
                message: "Game was interrupted by the room owner!"
            }
        )
        }

        return new NextResponse(JSON.stringify({ok: true, key: room[0].key}), { status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}