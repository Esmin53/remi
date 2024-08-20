import { games, hand } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || typeof session.user.name !== 'string') {
            return new NextResponse(JSON.stringify({ok: false}), { status: 401 });
        }

        const body = await req.json();

        const [game] = await db.select().from(games).where(eq(games.id, body.id))

        let tempDeck = game.deck?.slice(0, -1) || [];

            await db.update(games).set({
                deck: tempDeck,
            }).where(eq(games.id, body.id))

            await db.update(hand).set({
                cards: body.newHand
            }).where(and(
                eq(hand.gameId, body.id),
                eq(hand.player, session.user.name!)
            ))


        return new NextResponse(JSON.stringify({cardToDraw: tempDeck[tempDeck.length - 1]}), { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({error}), { status: 500 })
    }
}