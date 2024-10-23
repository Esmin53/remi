import HowToPlay from "@/components/HowToPlay";
import RoomProvider from "@/components/RoomProvider";
import { rooms } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export async function generateMetadata({ params }: LayoutProps) {
  const { slug } = params;
  
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${capitalizedSlug} | Rummy Online`, 
    description: `Rummy online room in ${capitalizedSlug} - room!`,
    icons: {
      icon: "/icon.ico", 
      href: "/icon.ico", 
    },
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const [roomData] = await db
    .select({
      owner: rooms.ownerName,
      background: rooms.background,
      table: rooms.table,
      deck: rooms.deck,
    })
    .from(rooms)
    .where(and(eq(rooms.key, params.slug)))
    .limit(1);

  return (
    <main className="flex w-screen h-screen relative">
        <Image 
        src={`/background/${roomData?.background}`}
        alt="Room Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <RoomProvider roomData={roomData || {}}>
        {children}
      </RoomProvider>
    </main>
  );
}