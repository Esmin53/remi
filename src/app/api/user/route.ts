import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getServerSession(authOptions)

        if(!session?.user || typeof session.user.name !== 'string') {
            return new NextResponse(JSON.stringify({ok: false}), { status: 401 });
        }

        const body = await req.json();

        

        
    } catch (error) {
        
    }
}

