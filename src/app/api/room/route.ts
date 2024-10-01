import { rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { RoomCredentialsValidator } from "@/lib/validators/room"
import { eq, or } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const POST = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user?.name) {
            return new NextResponse(JSON.stringify({ ok: false}), { status: 401})
        }

        const body = await req.json()

        const { key, allowRandom, background, table, deck} = RoomCredentialsValidator.parse(body)

        console.log("New Room: ", background, table, deck)

        const keyExists = await db.select({
            key: rooms.key,
            ownerName: rooms.ownerName
        }).from(rooms).where(or(
            eq(rooms.key, key),
            eq(rooms.ownerName, session.user.name)
        ))

        if(keyExists.length) {
            if(keyExists[0].ownerName === session.user.name) {
                return new NextResponse(JSON.stringify({ ok: false, message: "You are only allowed to create one room, please delete the old one before proceding."}), { status: 409})
            } else {
                return new NextResponse(JSON.stringify({ ok: false, message: "Room with that key already exists, please try another one!"}), { status: 409})
            }
        }

        const newRoom = await db.insert(rooms).values({
            key,
            background,
            table,
            deck,
            allowRandom,
            ownerName: session.user.name,
        }).returning({key: rooms.key})

        await db.update(users).set({roomKey: newRoom[0].key}).where(eq(users.username, session.user.name))

        return new NextResponse(JSON.stringify({ok: true, newRoom}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {status: 500})
    }
}

export const PUT = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions)

        const body = await req.json()

        if(!session?.user || !session.user.name) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized!"}), { status: 401 })
        }

        const room = await db.select({key: rooms.key}).from(rooms).where(eq(rooms.key, body.key))

        if(!room.length) {
            return new NextResponse(JSON.stringify({ message: "No such room"}), { status: 404 })
        }

        await db.update(users).set({roomKey: room[0].key}).where(eq(users.username, session.user.name))

        await pusherServer.trigger(
            toPusherKey(`players`), 
            'incoming-player', 
            [{id: 2, username: "test"}]
        )

        return new NextResponse(JSON.stringify({ok: true, key: room[0].key}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}