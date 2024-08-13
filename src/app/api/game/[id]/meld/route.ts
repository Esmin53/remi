import { hand, meld } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const POST = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user?.name) {
            return new NextResponse(JSON.stringify("Unauthorized"))
        }

        const body = await req.json()
        
        console.log(body)

        await db.insert(meld).values({
            cards: body.cardIds,
            gameId: body.gameId,
            player: session.user.name
        })

        const [{cards, handId}] = await db.select({
            cards: hand.cards,
            handId: hand.id
        }).from(hand).where(and(
            eq(hand.gameId, body.gameId),
            eq(hand.player, session.user.name)
        ))

        const filteredCards = cards?.filter(num => !body.cardIds.includes(num));

        console.log(filteredCards)

        await db.update(hand).set({cards: filteredCards}).where(eq(hand.id, handId))
        
        return new NextResponse(JSON.stringify({ ok: true}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}