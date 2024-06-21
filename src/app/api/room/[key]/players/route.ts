import { rooms, users } from "@/db/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


export const GET = async (req: Request, res: Response) => {
    try {
        const url = new URL(req.url)
        const { pathname } = url
        const key = pathname.split("/")[3]

        //const {roomKey} = await db.select({key: rooms.key}).from(rooms).where(eq())

        const players = await db.select({
            id: users.id,
            username: users.username,
        }).from(users).where(eq(users.roomKey, key))

        return new NextResponse(JSON.stringify({players}), {status: 200})
    } catch (error) {
        
    }
}
