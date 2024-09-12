import { rooms, users } from "@/db/schema"
import authOptions from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"


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