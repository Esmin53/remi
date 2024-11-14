import { games, rooms } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { eq, inArray, ne } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user) return new NextResponse(JSON.stringify("Unauthorized!"), { status: 401 });

        let roomsArray = await db.select({
            key: rooms.key,
        }).from(rooms).where(eq(rooms.allowRandom, true)).intersectAll(
            db.select({key: games.roomKey}).from(games).where(ne(games.gameStatus, "IN_PROGRESS"))
        ).limit(4)

        let roomIds = roomsArray.map((item) => item.key)

        if(roomIds.length === 0) {
            return new NextResponse(JSON.stringify([]), { status: 200})
        }

        const roomInfoArray = await db.select({
            key: rooms.key,
            background: rooms.background,
            table: rooms.table
        }).from(rooms).where(inArray(rooms.key, roomIds))

        return new NextResponse(JSON.stringify(roomInfoArray), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500})
    }
}