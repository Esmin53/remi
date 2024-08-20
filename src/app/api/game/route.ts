import { games, hand, rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { shuffle, toPusherKey } from "@/lib/utils"
import { and, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
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

        await db.update(games).set({ gameStatus: "FINISHED"}).where(eq(games.roomKey, body.key))

        const [game] = await db.insert(games).values({
            deck: [],
            roomKey: body.key,
            gameStatus: "IN_PROGRESS",
        }).returning({ id: games.id })

        for(let i in players) {
            await db.insert(hand).values({
                gameId: game.id,
                player: players[i].username,
                cards: startingDeck.splice(0, parseInt(i) === 0 ? 15 : 14)
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
                cardToDraw: startingDeck[startingDeck.length - 1],
                currentTurn: players[0].username,
                gameStatus: "IN_PROGRESS",
                gameId: game.id,
                players: players.map((item) => item.username)
            }
        )

        return new NextResponse(JSON.stringify({ok: true}), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({error}), { status: 500 })
    }
}

export const PUT = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || typeof session.user.name !== 'string') {
            return new NextResponse(JSON.stringify({ok: false}), { status: 401 });
        }

        const body = await req.json();

        console.log("Body: ", body)

        const [game] = await db.select().from(games).where(eq(games.id, body.id))

        
        let tempDeck = [];
        if(!body.cardToDraw) {
            tempDeck = game.deck?.slice(0, -1) || []
        } else {
            tempDeck = game.deck?.slice(1) || []
        }

        tempDeck?.unshift(body.discartedCard)

        let currentPlayerIndex = game.turnOrder?.indexOf(game.currentTurn!) || 0

        //@ts-ignore
        let nextPlayer = game.turnOrder[currentPlayerIndex + 1] || game.turnOrder[0]
        let currentPlayer = game.currentTurn


            await db.update(games).set({
                deck: tempDeck,
                currentTurn: nextPlayer
            }).where(eq(games.id, body.id))

            await db.update(hand).set({
                cards: body.newHand
            }).where(and(
                eq(hand.gameId, body.id),
                eq(hand.player, currentPlayer!)
            ))


            if(body.newHand.length === 0) {
                await db.update(games).set({
                    gameStatus: "FINISHED"
                }).where(eq(games.id, body.id))
                
                await pusherServer.trigger(
                    toPusherKey(`game:${game.roomKey}:turn`), 
                    'game-turn', 
                    {
                        cardToDraw: tempDeck[tempDeck.length - 1],
                        discartedCard: tempDeck[0],
                        currentTurn: nextPlayer,
                        gameStatus: "FINISHED",
                    }
                )
                
                return new NextResponse(JSON.stringify({ok: true}), { status: 200 });
            }

        await pusherServer.trigger(
            toPusherKey(`game:${game.roomKey}:turn`), 
            'game-turn', 
            {
                cardToDraw: tempDeck[tempDeck.length - 1],
                discartedCard: tempDeck[0],
                currentTurn: nextPlayer,
                gameStatus: "IN_PROGRESS",
            }
        )


        return new NextResponse(JSON.stringify({ok: true}), { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({error}), { status: 500 })
    }
}