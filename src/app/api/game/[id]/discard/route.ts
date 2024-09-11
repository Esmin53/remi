import { games, hand } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || typeof session.user.name !== 'string') {
            return new NextResponse(JSON.stringify({ok: false}), { status: 401 });
        }

        const body = await req.json();
        const id = req.nextUrl.pathname.split('/')[3];

        console.log("Body: ", body, "Id: ", id)

        const [game] = await db.select().from(games).where(eq(games.id, parseInt(id)))

        if(game.deck === null) {
            return new NextResponse(JSON.stringify("Bad request"), { status: 500 })
        }

        game.deck?.unshift(body.discartedCard)

        let currentPlayerIndex = game.turnOrder?.indexOf(game.currentTurn!) || 0

        //@ts-ignore
        let nextPlayer = game.turnOrder[currentPlayerIndex + 1] || game.turnOrder[0]
        let currentPlayer = game.currentTurn


            await db.update(games).set({
                deck: game.deck,
                currentTurn: nextPlayer,
                playerDrew: false
            }).where(eq(games.id, parseInt(id)))

            await db.update(hand).set({
                cards: body.newHand
            }).where(and(
                eq(hand.gameId, parseInt(id)),
                eq(hand.player, currentPlayer!)
            ))


            if(body.newHand.length === 0) {
                await db.update(games).set({
                    gameStatus: "FINISHED",
                    winner: session.user.name
                }).where(eq(games.id, body.id))
                
                await pusherServer.trigger(
                    toPusherKey(`game:${game.roomKey}:turn`), 
                    'game-turn', 
                    {
                        cardToDraw: game.deck[game.deck.length - 1],
                        discartedCard: game.deck[0],
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
                cardToDraw: game.deck[game.deck.length - 1],
                discartedCard: game.deck[0],
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