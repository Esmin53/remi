import { rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { RoomCredentialsValidator } from "@/lib/validators/room"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export const POST = async (req: Request, res: Response) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user) {
            return new NextResponse(JSON.stringify({ ok: false}), { status: 401})
        }

        const body = await req.json()

        const { key, allowRandom} = RoomCredentialsValidator.parse(body)

        const keyExists = await db.select({key: rooms.key}).from(rooms).where(eq(rooms.key, key))

        if(keyExists.length) {
            return new NextResponse(JSON.stringify({ ok: false}), { status: 409})
        }

        const newRoom = await db.insert(rooms).values({
            key: key,
            allowRandom: allowRandom
        }).returning({key: rooms.key})

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

        return new NextResponse(JSON.stringify({ok: true, key: room[0].key}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}