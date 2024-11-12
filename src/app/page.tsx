import Avatar from "@/components/Avatar";
import JoinRoom from "@/components/JoinRoom";
import Menu from "@/components/Menu";
import RoomCreator from "@/components/RoomCreator";
import { rooms, users } from "@/db/schema";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  
  if(!session?.user) {
    redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/wellcome`)
  }

  const [{currentRoom, avatar, ownedRoom, background, table, deck, allowRandom}] = await db.select({
    username: users.username,
    currentRoom: users.roomKey,
    ownedRoom: rooms.key,
    avatar: users.avatar,
    background: rooms.background,
    table: rooms.table,
    deck: rooms.deck,
    allowRandom: rooms.allowRandom
  }).from(users).where(eq(users.username, session?.user?.name!)).leftJoin(rooms, eq(users.username, rooms.ownerName))

  if(currentRoom) {
    redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${currentRoom}`)
  }

  if(true) {
    return <main className="flex-1 flex justify-center relative max-h-screen" style={{backgroundImage: `url(/table/red.jpg)`}}>
        <Menu currentAvatar={avatar} currentUser={session.user.name}
                   roomKey={ownedRoom || null} 
                   currentBackground={background}
                   currentTable={table}
                   currentDeck={deck}
                   allowRandom={allowRandom}/>
      </main>
  }
}