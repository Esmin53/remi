import { ChevronLeft, ChevronRight, User2 } from "lucide-react";
import Players from "./Players";
import { useState } from "react";
import { cn } from "@/lib/utils";


const GameMenu = () => {
    const [hideMenu, setHideMenu] = useState(false)

    return (
        <div className="relative">
            <div className="absolute top-4 right-4 w-10 h-10 bg-lightblue cursor-pointer z-30 flex items-center justify-center rounded-full">
                <ChevronLeft className="w-8 h-8" onClick={() => setHideMenu(false)}/>
            </div>
            <div className={cn("h-full z-40 w-screen max-w-96 xl:w-96 absolute right-0 top-0 xl:relative bg-[#486581] min-h-screen ml-auto border-l border-lightblue shadow-sm p-2 flex flex-col gap-4", {
           "hidden": hideMenu 
        })}>
            <div className="absolute top-4 left-4 w-10 h-10 bg-lightblue cursor-pointer z-30 flex items-center justify-center rounded-full">
                <ChevronRight className="w-8 h-8" onClick={() => setHideMenu(true)}/>
            </div>
            <div className="w-full flex flex-col gap-2 justify-center items-center">
                <div className="w-40 h-40 rounded-full bg-paleblue border-2 shadow-sm border-lightblue relative">
                    <User2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lightblue w-20 h-20" />
                </div>
                <h2 className="text-2xl font-bold">Esmin53</h2>
            </div>
            <Players />
            <div className="flex-1 bg-lightblue rounded shadow p-2 flex gap-1">

                <input type="text" className="w-full h-10 border-none bg-paleblue mt-auto rounded-sm outline-none px-2 text-gray-900"
                placeholder="Write a message"/>
            </div>
        </div>
        </div>
    )
}

export default GameMenu;