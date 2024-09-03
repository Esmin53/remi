"use client"

import { Heart, X } from "lucide-react";
import { useState } from "react";
import JoinRoom from "./JoinRoom";
import NewRoomForm from "./NewRoomForm";
import { signOut } from "next-auth/react";

const Menu = () => {
    const [showRoomKeyForm, setShowRoomKeyForm] = useState<boolean >(false)
    const [showNewRoomForm, setShowNewRoomForm] = useState<boolean >(false)

    return (
          <div className="flex">
            {showRoomKeyForm || showNewRoomForm ? <div className="absolute top-2 right-2 z-[60] cursor-pointer" onClick={() => {
                setShowRoomKeyForm(false)
                setShowNewRoomForm(false)
            }}>
                <X className="text-red-500 w-7 h-7" />
            </div> : null}
            {showRoomKeyForm ? <JoinRoom /> : null}
            {showNewRoomForm ? <NewRoomForm /> : null}
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            -rotate-12 z-10 hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-8 hover:-translate-y-12"
            onClick={() => signOut({callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/wellcome`})}>
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Sign
                <br />Out</p>
            </div>
            <div className="w-52 h-64  bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer -ml-12 rounded-lg -translate-y-9 z-20
            hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-8 hover:-translate-y-12"
            onClick={() => setShowNewRoomForm(true)}>
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Create <br /> new 
                <br />Room</p>
            </div>
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer -ml-12  rotate-12 -translate-y-5 z-30
            hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-12 hover:-translate-y-12 hover:rotate-[5deg]"
            onClick={() => setShowRoomKeyForm(true)}>
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Enter <br /> room 
                <br />key</p>
            </div>
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            hover:shadow-brighter-red-glow duration-100 -ml-16 rotate-[20deg] z-40 translate-y-6 flex justify-center items-center hover:-translate-x-5 
            hover:-translate-y-4 hover:rotate-[8deg]">
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Find a 
                    <br />room</p>
            </div>
          </div>

    )
}

export default Menu;