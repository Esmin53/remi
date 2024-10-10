"use client"

import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { UserPlus2 } from "lucide-react";
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

    const {toast}= useToast()

    const updateAvatar = async () => {
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
            }


        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "There was an error and your avatar couldn't be updated, please try again later.",
                variant: "destructive"
            })
            console.log(error)
        }
    }

    return (
        <Popover>
            <PopoverTrigger className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-paleblue border-2 border-lightblue flex items-center justify-center relative
            overflow-hidden">
                <UserPlus2 className="text-lightblue w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20" />
                {avatarDisplay ? <Image fill alt="Current Avatar" src={`/avatar/${avatarDisplay}`} className="object-cover"/> : null}
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-[99vw] max-w-96">
                <div className="grid grid-cols-3 gap-2 w-full">
                    {avatars.map((item) => (
                        <div className={cn("aspect-square relative rounded-sm overflow-hidden shadow-sm cursor-pointer", {
                            "border border-red-500": avatar === item
                        })} key={item}
                        onClick={() => avatar === item ? setAvatar(null) : setAvatar(item)}>
                            <Image fill alt="Avatar" src={`/avatar/${item}`} className="object-center"/>
                        </div>
                    ))}
                </div>
                <button className="w-full h-10 bg-red-500 hover:bg-red-500/90 text-white font-medium rounded-sm" onClick={() => updateAvatar()}
                >Save</button>
            </PopoverContent>
        </Popover>
    )
}

export default Avatar;