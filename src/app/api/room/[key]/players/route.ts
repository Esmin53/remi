import { games, rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { desc, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const GET = async (req: Request, res: Response) => {
    try {
        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]

        console.log(key)

        const players = await db.select().from(users).where(eq(users.roomKey, key))

        return new NextResponse(JSON.stringify({players}), {status: 200})
    } catch (error) {
        
    }
}

export const PUT = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        const body = await req.json()

        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]

        console.log("Key", body.key)

        if(!session?.user || !session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized!"}), { status: 401 })
        }

        const room = await db.select({ key: rooms.key }).from(rooms).where(eq(rooms.key, body.key))
        
        if(!room.length) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }

        const [game] = await db.select({
            gameStatus: games.gameStatus
        }).from(games).where(eq(games.roomKey, key)).orderBy(desc(games.createdAt)).limit(1)

        if(game?.gameStatus === "IN_PROGRESS") {
            return new NextResponse(JSON.stringify({ message: "Locked"}), { status: 423 })
        }

        const players = await db.select({ username: users.username}).from(users).where(eq(users.roomKey, body.key)) 

        if(players.length > 3) {
            return new NextResponse(JSON.stringify({ message: "Room is full"}), { status: 403 })
        }

        await db.update(users).set({roomKey: room[0].key}).where(eq(users.username, session.user.name))

        await pusherServer.trigger(
            toPusherKey(`players:${key}`), 
            'incoming-player', 
            {
                updatedPlayers: [...players, {username: session.user.name}]
            }
        )

        return new NextResponse(JSON.stringify({ok: true, key: room[0].key}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}

export const DELETE = async (req: Request, res: Response) => {
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

        const room = await db.select({key: rooms.key}).from(rooms).where(eq(rooms.key, key))

        if(!room.length) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }

        await db.update(users).set({roomKey: null}).where(eq(users.username, session.user.name))

        if(gameStatus == 'IN_PROGRESS') {
            await db.update(games).set({
                gameStatus: "INTERRUPTED",
                currentTurn: null,
                deck: [],
            }).where(eq(games.id, parseInt(gameId)))
        }

        const players = await db.select().from(users).where(eq(users.roomKey, key))

        await pusherServer.trigger(
            toPusherKey(`players:${key}`), 
            'incoming-player', 
            {
                updatedPlayers: players
            }
        )

        await pusherServer.trigger(
            toPusherKey(`game:${key}:turn`), 
            'game-turn', 
            {
                gameStatus: "INTERRUPTED",
            }
        )

        return new NextResponse(JSON.stringify({ok: true, key: room[0].key}), { status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}