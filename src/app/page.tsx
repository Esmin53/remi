import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  
  console.log("Session: ", session)

  return (
    <main className="flex-1">
      <h1>Remi</h1>
    </main>
  );
}
