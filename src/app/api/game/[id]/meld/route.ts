import { hand, meld } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
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

        let [newMeld] = await db.insert(meld).values({
            cards: body.cardIds,
            gameId: body.gameId,
            player: session.user.name
        }).returning({
            id: meld.id,
            cards: meld.cards,
            gameId: meld.gameId,
            player: meld.player
        
        })

        const [{cards, handId}] = await db.select({
            cards: hand.cards,
            handId: hand.id
        }).from(hand).where(and(
            eq(hand.gameId, body.gameId),
            eq(hand.player, session.user.name)
        ))

        const filteredCards = cards?.filter(num => !body.cardIds.includes(num));

        await db.update(hand).set({cards: filteredCards}).where(eq(hand.id, handId))

        await pusherServer.trigger(
            toPusherKey(`game:${body.key}:meld`), 
            'game-meld', 
            {
                newMeld: newMeld,
                playerName: newMeld.player
            }
        )
        
        return new NextResponse(JSON.stringify({ ok: true}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}

export const PUT = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user?.name) {
            return new NextResponse(JSON.stringify("Unauthorized"))
        }

        const body = await req.json()

        let [updatedMeld] = await db.update(meld).set({
            cards: body.cards
        }).where(and(
            eq(meld.id, body.meldId),
            eq(meld.gameId, body.gameId)
        )).returning({
            id: meld.id,
            cards: meld.cards,
            gameId: meld.gameId,
            player: meld.player
        })

        const [{cards, handId}] = await db.select({
            cards: hand.cards,
            handId: hand.id
        }).from(hand).where(and(
            eq(hand.gameId, body.gameId),
            eq(hand.player, session.user.name)
        ))

        const filteredCards = cards?.filter(num => !body.cards.includes(num));

        console.log(filteredCards)

        await db.update(hand).set({cards: filteredCards}).where(eq(hand.id, handId))

        await pusherServer.trigger(
            toPusherKey(`game:${body.key}:meld`), 
            'game-meld', 
            {
                updatedMeld: updatedMeld,
                playerName: updatedMeld.player
            }
        )
        
        return new NextResponse(JSON.stringify({ ok: true}), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}

export const GET = async (req: Request, res: Response) => {
try {
    const url = new URL(req.url)
    const { pathname } = url
    const id = pathname.split("/")[3]

    
    const melds = await db.select().from(meld).where(eq(meld.gameId, parseInt(id)))

    const groupedMelds = melds.reduce((acc, meld) => {
        const player = meld.player;
    
        // Ensure player is not null or undefined before using it as a key
        if (player !== null && player !== undefined) {
            if (!acc[player]) {
                acc[player] = []; // If this player doesn't have an entry yet, create an empty array
            }
        
            acc[player].push(meld); // Add the current meld to the player's array
        }
    
        return acc;
    }, {} as Record<string, typeof melds[0][]>);
    

    console.log(groupedMelds)

    return new NextResponse(JSON.stringify({ groupedMelds }), { status: 200 })
} catch (error) {
    return new NextResponse(JSON.stringify({ ok: false}), { status: 500 })
}
}