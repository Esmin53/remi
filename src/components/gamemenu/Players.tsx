"use client"

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { Crown, LogOut, User, User2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface PlayersProps {
    owner: string,
    currentTurn: string | null,
    gameId: string | null,
    gameStatus: string | null
}

interface UpdatedPlayersProps {
    updatedPlayers: {
        username: string
        avatar: string | null
    }[]
    deleted?: string
    kicked?: string
} 

const Players = ({ owner, currentTurn, gameId, gameStatus }: PlayersProps) => {
    const [players, setPlayers] = useState<{
        username: string
        avatar: string | null
    }[] | null>(null)

    const key = usePathname().split("/")[2]
    const session = useSession()
    const router = useRouter()
    const { toast } = useToast()

    // Handles players joining and leaving but also players being kicked and room being deleted
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`players:${key}`))
        
            const messagesHandler = ({updatedPlayers, deleted, kicked}: UpdatedPlayersProps) => {
                
                if(deleted && deleted === "ROOM_DELETED") {
                    toast({
                        title: "Room was deleted",
                        description: "This room was deleted by owner.",
                        variant: "destructive"
                    })
                    router.push("/")
                    router.refresh()
                    return
                }

                if(kicked && kicked === session.data?.user?.name) {
                    toast({
                        title: "You were removed from the room",
                        description: "You were kicked from the room by the room owner.",
                        variant: "destructive"
                    })
                    router.push("/")
                    router.refresh()
                }
                
                setPlayers(updatedPlayers)
            }
    
        pusherClient.bind(`incoming-player`, messagesHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`players:${key}`))
            pusherClient.unbind('incoming-player', messagesHandler)
        }
    }, [])

    const getPlayers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`)

            const data = await response.json()
            
            setPlayers(data.players)
        } catch (error) {
            
        }
    }

    const kickPlayer = async (player: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/owner/kick?gameId=${gameId}&gameStatus=${gameStatus}&playerName=${player}`, {
                method: "DELETE"
            });

            const data = await response.json()

        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
        }
    }

    console.log("Players: ", players)

    useEffect(() => {
        getPlayers()
    }, [])

    if(!players) {
        return (
            <div className="w-full grid grid-cols-2 p-2 gap-2 bg-lightblue rounded shadow-sm items-center justify-evenly min-h-16">
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded-md relative animate-pulse" />
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded-md relative animate-pulse" />
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded-md relative animate-pulse" />
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded-md relative animate-pulse" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full gap-1">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{key}</h1>
                <div className="flex items-center gap-1">
                    <User2/>
                    <p className="font-medium">{players.length}/4</p>
                </div>
            </div>
            <div className="h-0.5 w-5/6 bg-lightblue rounded-lg" />
            <div className="w-full grid grid-cols-4 sm:grid-cols-2 p-2 sm:p-4 gap-1 sm:gap-3 sm:gap-y-2 bg-lightblue shadow-sm rounded mt-1">
            { players.map((item) => <div className="w-full h-full flex flex-col items-center" key={item.username}>
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded sm:rounded-md relative">
                {item.username === owner ? (
                    <Crown
                    className="absolute top-0 left-0 w-4 h-4 sm:w-7 sm:h-7 -translate-x-1 -translate-y-1 text-amber-400 z-40 -rotate-45"
                    />
                ) : null}
                {item.avatar ? (
                    <Image
                    fill
                    alt={`${item.username}'s avatar`}
                    src={`/avatar/${item.avatar}`}
                    className="rounded-md z-20 object-center"
                    />
                ) : null}
                    <User2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 sm:w-24 sm:h:24 lg:w-28 lg:h-28 text-lightblue z-10"/>
                    {session.data?.user?.name === owner && item.username !== owner ? 
                    <AlertDialog>
                    <AlertDialogTrigger>
                        <LogOut className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-red-400 z-30" /> 
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        Removing a player from the room will interrupt any game that may be in progress.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => kickPlayer(item.username)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                    : null}
                    {item.username === currentTurn ? <Image alt="Cards icon" src='/cards.png' quality={100} width={52} height={52} className="absolute left-0 bottom-0 -translate-x-2.5 translate-y-2.5 z-30 w-8 h-8 sm:w-14 sm:h-14"/> : null}
                </div>
                <p className="text-sm sm:text-lg font-medium text-gray-800">{item.username}</p>
            </div>)}
        </div>
        </div>
    )
}

export default Players