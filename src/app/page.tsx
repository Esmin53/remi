import Menu from "@/components/Menu";
import TablePicker from "@/components/TablePicker";
import { rooms, users } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  
  if(!session?.user) {
    redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/wellcome`)
  }

  const [user] = await db.select({
    username: users.username,
    currentRoom: users.roomKey,
    ownedRoom: rooms.key
  }).from(users).where(eq(users.username, session?.user?.name!)).leftJoin(rooms, eq(users.username, rooms.ownerName))

  if(user?.currentRoom) {
    redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${user?.currentRoom}`)
  }

  return (
    <main className="flex-1 flex justify-center relative" style={{backgroundImage: `url(/homepage.jpeg)`}}>
      <div className="flex-1 flex items-center justify-evenly">
        <div className="flex flex-col h-full justify-evenly items-start">
         <div className="w-96 flex gap-3 justify-start items-center">
          <div className="w-32 h-32 rounded-full bg-paleblue border-2 border-lightblue flex items-center justify-center">
            <User2 className="text-lightblue w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20" />
          </div>
          <div className="flex flex-col justify-evenly">
            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
            {user.ownedRoom ? <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${user.ownedRoom}`} className="text-gray-400 cursor-pointer">
              <span className="font-semibold">{user.ownedRoom}</span>{" (your room)"}</Link> : null}
          </div>
         </div>
         <Menu />
        </div>
        <TablePicker />
      </div>
    </main>
  );
}
