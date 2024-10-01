"use client"

import { Heart, X } from "lucide-react";
import { useState } from "react";
import JoinRoom from "./JoinRoom";
import NewRoomForm from "./NewRoomForm";
import { signOut } from "next-auth/react";
import Image from "next/image";
 
const Menu = () => {
    const [showRoomKeyForm, setShowRoomKeyForm] = useState<boolean >(false)


    return (
          <div className="flex flex-row-reverse sm:flex-row justify-start sm:justify-center w-screen sm:w-full overflow-x-auto sm:overflow-visible p-2 gap-3 no-scrollbar">
            {showRoomKeyForm ? <div className="absolute top-2 right-2 z-[56] cursor-pointer" onClick={() => {
                setShowRoomKeyForm(false)

            }}>
                <X className="text-red-500 w-7 h-7" />
            </div> : null} 
            {showRoomKeyForm ? <JoinRoom /> : null}
            {/*showNewRoomForm ? <NewRoomForm /> : null*/}
            <div className=" flex-shrink-0 w-36 sm:w-40 sm:h-52 md:w-44 md:h-56 xl:w-52 h-44 xl:h-64 rounded-md sm:rounded-lg bg-[#4d4d4d] border sm:border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            sm:-rotate-12 z-10 hover:shadow-brighter-red-glow duration-100 flex items-center justify-center sm:hover:-translate-x-8 sm:hover:-translate-y-12"
            onClick={() => signOut({callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/wellcome`})}>
                <Image src='/icns/hearts.png' alt="Heart Icon" width={24} height={24} className="absolute left-1 sm:left-2 top-1 sm:top-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <Image src='/icns/hearts.png' alt="Heart Icon" width={24} height={24} className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <p className="sm:text-xl font-medium sm:font-semibold text-red-500 text-center">Sign
                <br />Out</p>
            </div>

            <div className="flex-shrink-0 w-36 sm:w-40 sm:h-52  md:w-44 md:h-56 xl:w-52 h-44 xl:h-64 rounded-md sm:rounded-lg lg:rounded-lg bg-[#4d4d4d] border sm:border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer sm:-ml-12  sm:rotate-12 sm:-translate-y-5 z-30
            hover:shadow-brighter-red-glow duration-100 flex items-center justify-center sm:hover:-translate-x-12 sm:hover:-translate-y-12 hover:rotate-[5deg]"
            onClick={() => setShowRoomKeyForm(true)}>
                <Image src='/icns/spades.png' alt="Heart Icon" width={24} height={24} className="absolute left-1 sm:left-2 top-1 sm:top-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <Image src='/icns/spades.png' alt="Heart Icon" width={24} height={24} className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <p className="sm:text-xl font-medium sm:font-semibold text-red-500 text-center">Enter <br /> room 
                <br />key</p>
            </div>
            <div className="flex-shrink-0 w-36 sm:w-40 sm:h-52 md:w-44 md:h-56 xl:w-52 h-44 xl:h-64 rounded-md sm:rounded-lg lg:rounded-lg bg-[#4d4d4d] border sm:border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            hover:shadow-brighter-red-glow duration-100 sm:-ml-16 sm:rotate-[20deg] z-40 sm:translate-y-6 flex justify-center items-center sm:hover:-translate-x-5 
            sm:hover:-translate-y-4 hover:rotate-[8deg]">
                <Image src='/icns/clubs.png' alt="Heart Icon" width={24} height={24} className="absolute left-1 sm:left-2 top-1 sm:top-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <Image src='/icns/clubs.png' alt="Heart Icon" width={24} height={24} className="absolute right-1 sm:right-2 bottom-1 sm:bottom-2 w-6 sm:w-10 h-5 sm:h-10"/>
                <p className="sm:text-xl font-medium sm:font-semibold text-red-500 text-center">Find a 
                    <br />room</p>
            </div>
          </div>

    )
}

export default Menu;