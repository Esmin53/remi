import { rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3] as string

        const [data] = await db.select({
            background: rooms.background,
            table: rooms.table,
            deck: rooms.deck,
            allowRandom: rooms.allowRandom
        }).from(rooms).where(eq(rooms.key, key))

        return new NextResponse(JSON.stringify(data), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({message: "Failed"}), { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || !session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized!"}), { status: 401 })
        }

        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3] as string

        const [room] = await db.select({
            key: rooms.key,
            owner: rooms.ownerName
        }).from(rooms).where(eq(rooms.key, key))

        if(!room) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }

        if(session.user.name !== room.owner) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized"}), { status: 401 })
        }

        await db.delete(rooms).where(eq(rooms.key, room.key))

        await db.update(users).set({
            roomKey: null
        }).where(eq(users.roomKey, room.key))

        await pusherServer.trigger(
            toPusherKey(`players:${key}`), 
            'incoming-player', 
            {
                updatedPlayers: [],
                deleted: "ROOM_DELETED"
            }
        )

        return new NextResponse(JSON.stringify({message: "Success"}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({message: "Failed"}), { status: 500 })
    }
}

export const PATCH = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || !session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized!"}), { status: 401 })
        }

        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3] as string

        const { background, table, deck, allowRandom } = await req.json();

        const [room] = await db.select({
            key: rooms.key,
            owner: rooms.ownerName,
            background: rooms.background,
            table: rooms.table,
            deck: rooms.deck,
            allowRandom: rooms.allowRandom
        }).from(rooms).where(eq(rooms.key, key))

        if(!room) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }

        if(session.user.name !== room.owner) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized"}), { status: 401 })
        }

        await db.update(rooms).set({
            background,
            table,
            deck,
            allowRandom
        }).where(eq(rooms.key, room.key))


        return new NextResponse(JSON.stringify({message: "Success"}), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({message: "Failed"}), { status: 500 })
    }
}