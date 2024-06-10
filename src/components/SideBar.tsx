"use client"

import { User2 } from "lucide-react"

const SideBar = () => {

    return (
        <div className="h-full w-96 bg-[#486581] min-h-screen ml-auto border-l border-lightblue shadwo-sm p-2 flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2 justify-center items-center">
                <div className="w-40 h-40 rounded-full bg-paleblue border-2 shadow-sm border-lightblue relative">
                    <User2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lightblue w-20 h-20" />
                </div>
                <h2 className="text-2xl font-bold">Esmin53</h2>
            </div>
            <div className="w-full flex flex-col gap-2">
                <p className="text-xl font-medium">Find a new room</p>
                <div className="h-0.5 w-3/4 bg-lightblue rounded-lg" />
                <input className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm"
                placeholder="Room key" />
                <button className="w-full h-10 bg-peach hover:bg-peach/90 shadow rounded-sm font-medium flex items-center justify-center">
                Join room
            </button>
            </div>
            <div className="flex-1 bg-lightblue rounded-sm shadow-sm">

            </div>
        </div>
    )
}

export default SideBar