import { games, hand, rooms } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const GET = async (req: Request, res: Response) => {
    try {
        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]

        const session = await getServerSession(authOptions)

        if(!session || !session.user?.name) {
            return new NextResponse(JSON.stringify("Unauthorized"))
        }
        
        const [currentGame] = await db.select({ 
            id: games.id,
            turnOrder: games.turnOrder,
            deck: games.deck
        }).from(rooms)
        .leftJoin(games, eq(rooms.key, games.roomKey)).where(eq(games.gameStatus, "IN_PROGRESS"))

        if(!currentGame.id) {
            return new NextResponse(JSON.stringify("No such game"), { status: 404 })
        }

        const [{cards}] = await db.select({
            cards: hand.cards
        }).from(hand).where(and(
            eq(hand.gameId, currentGame.id),
            eq(hand.player, session?.user?.name)
        ))

        const [{isDiscardedCard}] = await db.select({
            isDiscardedCard: hand.cards
        }).from(hand).where(and(
            eq(hand.gameId, currentGame.id),
            eq(hand.player, currentGame.turnOrder![0])
        ))

        console.log("Is Discarded Card: ", isDiscardedCard?.length)
        const discardedCard = isDiscardedCard?.length === 15 ? null : currentGame?.deck![0] 

        console.log("CARDS: ", cards, )

        return new NextResponse(JSON.stringify({ ok: true, cards, discardedCard }), { status: 200 })
    } catch (error) {
        
    }
}