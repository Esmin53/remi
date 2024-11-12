"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, LogOut, LucideFileText, LucideImage, LucideUsers, Settings2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import HowToPlay from "./HowToPlay";
import RoomCreator from "./RoomCreator";
import Rooms from "./Rooms";
import RummyRules from "./Rules";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


interface MenuProps {
    currentAvatar: string | null
    currentUser: string | null | undefined
    roomKey: string | null,
    currentBackground: string | null,
    currentTable: string | null,
    currentDeck: string | null,
    allowRandom: boolean | null
}

const Menu = ({currentAvatar, currentUser, roomKey, currentBackground, currentTable, currentDeck, allowRandom}: MenuProps) => {
    const [menu, setMenu] = useState<"rooms" | "edit-room" | "rules">("rooms")
    const [miniMenu, setMiniMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const variants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
      };


      useEffect(() => {
        if (typeof window !== 'undefined') { // Check if running on the client
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log("Element is visible on screen");
                        setMiniMenu(false);
                    } else {
                        setMiniMenu(true);
                    }
                });
            });

            if (menuRef.current) {
                observer.observe(menuRef.current);
            }

            return () => {
                if (menuRef.current) observer.unobserve(menuRef.current);
            };
        }
    }, [menuRef]);

    return (
          <div className="flex-1 flex flex-col no-scrollbar">
            <div className="w-full h-16 px-6 lg:px-16 flex items-center justify-center pt-1">
                <div className="relative h-full aspect-video">
                    <Image fill alt="Logo" src="/logo01.png"/>
                </div>
                <div className="ml-auto">
                    <HowToPlay />
                </div>
            </div>
            <div className="flex-1 px-6 xl:px-16 py-2 flex flex-col no-scrollbar">
      <AnimatePresence mode="wait">
        {menu === "rooms" && (
          <motion.div
            key="rooms"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.35 }}
            className="flex flex-1"
          >
            <Rooms />
          </motion.div>
        )}
        {menu === "rules" && (
          <motion.div
            key="rules"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.35 }}
            className="flex-1 flex"
          >
            <RummyRules />
          </motion.div>
        )}
        {menu === "edit-room" && (
          <motion.div
            key="edit-room"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.35 }}
          >
            <RoomCreator
              roomKey={roomKey || null}
              currentBackground={currentBackground}
              currentTable={currentTable}
              currentDeck={currentDeck}
              allowRandom={allowRandom}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
            <div 
            className={cn("w-full py-2 px-2 sm:px-6 lg:px-8 xl:px-16 flex flex-col sm:flex-row flex-wrap items-center bg-red-900/50 z-50 space-y-4")} ref={menuRef}>
                <div className="flex flex-col md:flex-row items-center md:gap-2 justify-center">
                    <Avatar currentAvatar={currentAvatar} />
                    <h2 className="text-lg md:text-2xl font-medium lg:font-semibold">{currentUser}</h2>
                </div>
                <div className="hidden md:flex h-fit mx-6 min-h-[1em] w-[1.5px] self-stretch bg-gradient-to-tr my-auto from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                
                <ul className={cn("flex px-2 sm:px-3 lg:px-4  lg:text-lg font-semibold duration-100", {
                  "fixed bottom-2 left-4 lg:gap xl:gap-3": miniMenu,
                  "gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16": !miniMenu
                })}>
                    {miniMenu ? <div className={cn("w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-gray-900/35 flex items-center justify-center mx-2 border-2 border-gray-900/25 shadow cursor-pointer", {
                      "border-red-600 -translate-y-3 shadow-red-glow animate-bbounce": menu === 'rooms'
                    })} onClick={() => setMenu("rooms")}>
                        <LucideUsers className="w-7 h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
                    </div> 
                    : <li className={cn("cursor-pointer duration-100", {
                        "-translate-y-3 text-lg md:text-xl lg:text-2xl font-bold duration-100": menu === "rooms"
                    }) } onClick={() => setMenu("rooms")}>Find Room</li>}
                    {miniMenu ? <div className={cn("w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-gray-900/35 flex items-center justify-center mx-2 border-2 border-gray-900/25 shadow cursor-pointer", {
                    "border-red-600 -translate-y-3 shadow-red-glow animate-bbounce": menu === 'edit-room'
                    })} onClick={() => setMenu("edit-room")}>
                        <Settings2 className="w-7 h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
                    </div> 
                    : <li className={cn("cursor-pointer duration-100", {
                      "-translate-y-3 text-lg md:text-xl lg:text-2xl font-bold duration-100": menu === "edit-room"
                  }) } onClick={() => setMenu("edit-room")}>My Room</li>}

                    {miniMenu ? <div className={cn("w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-gray-900/35 flex items-center justify-center mx-2 border-2 border-gray-900/25 shadow cursor-pointer", {
                    "border-red-600 -translate-y-3 shadow-red-glow animate-bbounce": menu === 'rules'
                    })} onClick={() => setMenu("rules")}>
                        <LucideFileText className="w-7 h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
                    </div> 
                    : <li className={cn("cursor-pointer duration-100", {
                        "-translate-y-3 text-lg md:text-xl lg:text-2xl font-bold duration-100": menu === "rules"
                    })} onClick={() => setMenu("rules")}>Rules</li>}
                </ul>

                <div className="ml-auto flex items-center gap-2 lg:gap-4">
                <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="rounded-full bg-gray-900/40 w-10 h-10 flex items-center justify-center shadow">
                            <Link href={`/assets`}>
                            <LucideImage className="w-6 h-6"/>
                            </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Assets</p>
                            </TooltipContent>
                         </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="rounded-full bg-gray-900/40 w-10 h-10 flex items-center justify-center">
                                <Code2 className="w-6 h-6"/>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Developer information</p>
                            </TooltipContent>
                         </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="rounded-full bg-gray-900/40 w-10 h-10 flex items-center justify-center shadow">
                                <a target="_blank" href="https://github.com/Esmin53/remi" className="w-7 h-7 relative ">
                                    <Image fill alt="Github logo" src={"/icns/github.png"}/>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Github Repository</p>
                            </TooltipContent>
                         </Tooltip>
                    </TooltipProvider>
                    {/*
                    <a target="_blank" href="https://icons8.com/icon/62856/github">GitHub</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="rounded-full bg-gray-900/40 w-10 h-10 flex items-center justify-center shadow">
                                <a target="_blank" href="https://github.com/Esmin53" className="w-6 h-6 relative">
                                    <Image fill alt="App logo" src={"/icon.ico"}/>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Developed by esmin53</p>
                            </TooltipContent>
                         </Tooltip>
                    </TooltipProvider>
                    <div className="rounded-full bg-gray-900/40 w-10 h-10 flex items-center justify-center shadow cursor-pointer"
                    onClick={() => signOut({redirect: true, callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/wellcome`})}>
                        <LogOut className="w-6 h-6"/>
                    </div>
                </div>
            </div>
          </div>

    )
}

export default Menu;