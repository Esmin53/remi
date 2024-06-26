import { games, hand, rooms, users } from "@/db/schema"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { shuffle, toPusherKey } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = (req: Request, res: Response) => {
    try {
        let startingDeck = shuffle()

        let playerOne = startingDeck.splice(0, 14)

        return new NextResponse(JSON.stringify({startingDeck, playerOne}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}

export const POST = async (req: Request, res: Response) => {
    try {
        let startingDeck = shuffle()

        const body = await req.json()

        const players = await db.select({
            username: users.username,
        }).from(rooms).where(eq(rooms.key, body.key)).rightJoin(users, eq(rooms.key, users.roomKey));

        const [game] = await db.insert(games).values({
            deck: [],
            roomKey: body.key,
            gameStatus: "IN_PROGRESS"
        }).returning({ id: games.id })

        for(let i in players) {
            await db.insert(hand).values({
                gameId: game.id,
                player: players[i].username,
                cards: startingDeck.splice(0, 14)
            })
        }

        await db.update(games).set({ 
            deck: startingDeck,
            turnOrder: players.map((item) => item.username),
            currentTurn: players[0].username
        }).where(eq(games.id, game.id))

        await pusherServer.trigger(
            toPusherKey(`game:${body.key}:turn`), 
            'game-turn', 
            {
                startingDeck,
                currentTurn: players[0].username
            }
        )

        return new NextResponse(JSON.stringify({ok: true}), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({error}), { status: 500 })
    }
}