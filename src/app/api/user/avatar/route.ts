import { users } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || typeof session.user.name !== 'string') {
            return new NextResponse(JSON.stringify({ok: false}), { status: 401 });
        }

        const body = await req.json();

        await db.update(users).set({avatar: body.avatar}).where(eq(users.username, session.user.name))

        return new NextResponse(JSON.stringify({ok: true}), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ok: false}), { status: 500 });
    }
}
