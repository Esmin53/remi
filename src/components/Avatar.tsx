"use client"

import { useEffect, useRef, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Loader2, UserPlus2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Session } from "inspector";

interface AvatarProps {
    currentAvatar: string | null
}

const Avatar = ({currentAvatar}: AvatarProps ) => {

    const avatars = [
        "avatar01.jpg",
        "avatar02.jpg",
        "avatar03.jpg",
        "avatar04.jpg",
        "avatar05.jpg",
        "avatar06.jpg",
        "avatar07.jpg",
        "avatar08.jpg",
        "avatar09.jpg",
    ]

    const {data: session, update} = useSession()

    const [avatar, setAvatar] = useState<string | null>(currentAvatar)
    const [avatarDisplay, setAvatarDisplay] = useState<string | null>(currentAvatar)
    const [isModalOpen, setIsModalOpen] = useState<boolean >(false)
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {toast}= useToast()

    const updateAvatar = async () => {
        if(isLoading) return
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/avatar`, {
                method: "PUT",
                body: JSON.stringify({
                    avatar
                })
            })

            if(response.ok) {
                setAvatarDisplay(avatar)
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        image: avatar
                    }
                })

                setIsModalOpen(false)
            }


        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "There was an error and your avatar couldn't be updated, please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }


    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsModalOpen(false); 
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <div className="">
            <div
                className="cursor-pointer w-16 h-16 md:w-24 md:h-24 rounded-full bg-paleblue border-2 border-lightblue flex items-center justify-center relative overflow-hidden"
                onClick={() => setIsModalOpen(true)}
            >
                <UserPlus2 className="text-lightblue w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20" />
                {avatarDisplay ? (
                    <Image fill alt="Current Avatar" src={`/avatar/${avatarDisplay}`} className="object-center" />
                ) : null}
            </div>
            {isModalOpen ? (
                <div
                    className="fixed w-screen h-screen top-0 left-0 bg-[#4d4d4d]/50 z-40 flex items-center justify-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        ref={modalRef}
                        className="aspect-square h-[95vh] max-h-96 bg-white shadow rounded-md flex flex-col gap-2 p-2 z-50 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-1 grid grid-cols-3 gap-1">
                            {avatars.map((item) => (
                                <div
                                    className={cn("w-full h-full relative rounded-sm overflow-hidden shadow-sm cursor-pointer", {
                                        "border border-red-500": avatar === item,
                                    })}
                                    key={item}
                                    onClick={() => (avatar === item ? setAvatar(null) : setAvatar(item))}
                                >
                                    <Image fill alt="Avatar" src={`/avatar/${item}`} className="object-cover object-center" />
                                </div>
                            ))}
                        </div>

                        <button
                            className="w-full h-10 bg-red-500 hover:bg-red-500/90 text-white font-medium rounded-sm flex items-center justify-center"
                            onClick={() => updateAvatar()}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Avatar;