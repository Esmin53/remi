import { users } from "@/db/schema"
import { db } from "@/lib/db"
import { AuthCredentialsValidator } from "@/lib/validators/auth"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import { signIn } from "next-auth/react"

export const POST = async (req: Request) => {
    try {
        const body = await req.json()

        const { username, password, } = AuthCredentialsValidator.parse(body)

        const isUsernameTaken = await db.select().from(users).where(eq(users.username, username)).limit(1)

        if(isUsernameTaken.length !== 0) {
            return new Response(JSON.stringify({success: false, message: "This username is already taken please try a different one"}), { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.insert(users).values({
            username,
             password: hashedPassword,
        })

        return new Response(JSON.stringify({success: true}), { status: 200})
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify("Generic server error"), { status: 500 })
    }
    }