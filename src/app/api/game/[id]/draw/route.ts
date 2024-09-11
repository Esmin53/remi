import { games, hand } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
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

        const [{deck}] = await db.select({ deck: games.deck}).from(games).where(eq(games.id, parseInt(id)))

        if(!deck) {
            return new NextResponse(JSON.stringify("Bad Request"), { status: 400 })
        }

        let card = deck.pop()

        let newHand: number[] = [...body.hand, card]

            await db.update(games).set({
                deck: deck,
                playerDrew: true
            }).where(eq(games.id, parseInt(id)))

            await db.update(hand).set({
                cards: newHand
            }).where(and(
                eq(hand.gameId, parseInt(id)),
                eq(hand.player, session.user.name!)
            ))


        return new NextResponse(JSON.stringify({cardToDraw: [card]}), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({error}), { status: 500 })
    }
}