import Menu from "@/components/Menu";
import TablePicker from "@/components/TablePicker";
import authOptions from "@/lib/auth";
import { User2 } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  


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
            <p className="text-gray-400 cursor-pointer">Take me to my room</p>
          </div>
         </div>
         <Menu />
        </div>
        <TablePicker />
      </div>
    </main>
  );
}
