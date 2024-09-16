import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../lib/db"
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import { users } from "@/db/schema";

declare module 'next-auth' {
    interface User {
      id: number; 
    }
  }

const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    providers: [
        Credentials({
            name: "Credentials",
            
            credentials: {
                username: { label: "Username", type: "username", placeholder: "username"},
                password: { label: "Password", type: "password", placeholder: "password"}
            },

            async authorize(credentials, req) {

                if(!credentials?.username || !credentials?.password) {
                    throw new Error("Unauthorized")
                }

                try {

                    console.log("Credentials", credentials)

                    const user = await db.select({
                        id: users.id,
                        username: users.username,
                        password: users.password,
                        image: users.avatar
                    }).from(users).where(eq(users.username, credentials?.username))     

                    if(!user[0]) {
                        console.log("No user[0]")
                        throw new Error("Unauthorized")
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user[0].password)

                    if(!isMatch) {
                        console.log("No isMatch")
                        throw new Error("Unauthorized")
                    } else {
                        return user[0]
                    }
                } catch (error) {
                    console.log(error)
                    return null 
                }
            },
        })
    ],
    pages: {
        signIn: "/wellcome"
    },
    callbacks: {
        jwt: async ({ user, token, trigger, session }) => {
            if(trigger === "update") {
                return {...token, ...session.user}
            }

            if (user) {
                return {
                    //@ts-ignore
                    name: user.username,
                    image: user.image,
                    id: user.id
                } 
            }
            return token
        },
        session: async({ session, token }) => {
            if(session?.user) {
                session.user.name = token.name 
                //@ts-ignore
                session.user.id = token.id
                session.user.image = token.image as string | null
            }
            return Promise.resolve(session)
        },
    },

}

export default authOptions;