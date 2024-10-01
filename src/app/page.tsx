import Avatar from "@/components/Avatar";
import DeckPicker from "@/components/DeckPicker";
import GameOptions from "@/components/GameOptions";
import Menu from "@/components/Menu";
import RoomCreator from "@/components/RoomCreator";
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
    ownedRoom: rooms.key,
    avatar: users.avatar
  }).from(users).where(eq(users.username, session?.user?.name!)).leftJoin(rooms, eq(users.username, rooms.ownerName))

  if(user?.currentRoom) {
    redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${user?.currentRoom}`)
  }

  return (
    <main className="flex-1 flex justify-center relative px-2" style={{backgroundImage: `url(/homepage.jpeg)`}}>
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-evenly px-2 md:px-4 py-6 ">
        <div className=" flex flex-col sm:flex-row lg:flex-col lg:h-full sm:justify-evenly items-center gap-10 sm:items-start w-full lg:w-fit">
         <div className="lg:w-96 flex flex-col lg:flex-row gap-1 md:gap-3 items-center px-2 justify-center">
          <Avatar currentAvatar={user.avatar || null}/>
          <div className="flex flex-col justify-evenly">
            <h1 className="text-xl md:text-2xl font-semibold lg:font-bold">{session?.user?.name}</h1>
            {user.ownedRoom ? <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${user.ownedRoom}`} className="text-gray-400 cursor-pointer">
              <span className="font-semibold">{user.ownedRoom}</span>{" (your room)"}</Link> : null}
          </div>
         </div>
        <Menu />
        </div>
        <div className="flex flex-col justify-start items-center sm:w-fit gap-2">
          <div className="w-full flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-semibold">Create your own room.</h1>
            <p className="text-sm sm:text-base">Customize your own room to play with friends, or find players from public lobby.</p>
          </div>
          <RoomCreator />
        </div>
      </div>
    </main>
  );
}
