import Avatar from "@/components/Avatar";
import JoinRoom from "@/components/JoinRoom";
import RoomCreator from "@/components/RoomCreator";
import { rooms, users } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Image from "next/image";
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
      <div className="flex-1 flex flex-col px-2 md:px-4 py-6">
          <div className="w-full">

          </div>
          <div className="flex w-full flex-col md:flex-row gap-4 items-center justify-evenly flex-1">
          <div className=" flex flex-col  flex-1 max-w-4xl gap-6 w-full">
            <div className="w-full flex flex-col-reverse md:flex-row gap-4">
              <div className="flex-1 ">
                <h1 className="text-2xl lg:text-3xl font-semibold">Join your friends.</h1>
                <p className="text-base">Enter a room key and join a room.</p>
                <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
                <JoinRoom />
              </div>
              <div className="flex flex-col justify-center items-center lg:w-64 ">
                <Avatar currentAvatar={user.avatar || null}/>
                <h1 className="text-xl lg:text-2xl font-semibold lg:font-bold">{session?.user?.name}</h1>
              </div>
            </div>
            

          <div>
            <h1 className="text-3xl font-semibold">Find a room.</h1>
            <p className="text-base">Join a room and start playing now.</p>
            <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
          </div>
          <div className="w-full h-96 bg-[#4d4d4d]/60 rounded-lg border-2 border-gray-700 shadow-lg"></div>




        </div>
        <div className="flex flex-col justify-start items-center sm:w-fit gap-2 md:max-w-96 xl:max-w-xl">
          <div className="w-full flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-semibold">Create your own room.</h1>
            <p className="text-sm sm:text-base">Customize your own room to play with friends, or find players from public lobby.</p>
          </div>
          <RoomCreator />
        </div>
          </div>

      </div>
    </main>
  );
}
