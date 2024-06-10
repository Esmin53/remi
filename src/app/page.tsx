import NewRoomForm from "@/components/NewRoomForm";
import SideBar from "@/components/SideBar";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  
  const session = await getServerSession(authOptions)
  


  return (
    <main className="flex-1 flex justify-center">
      <div className="flex-1 mx-auto flex p-4 gap-4">
        <div className="flex-1 max-w-96 bg-lightblue rounded-md shadow">

        </div>
        <div className="flex-1 flex flex-col gap-4">
          <NewRoomForm />
        </div>
      </div>
      <SideBar />
    </main>
  );
}
