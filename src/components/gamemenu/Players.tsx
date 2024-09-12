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
    updatedPlayers: {username: string}[]
    deleted?: string
    kicked?: string
} 

const Players = ({ owner, currentTurn, gameId, gameStatus }: PlayersProps) => {
    const [players, setPlayers] = useState<{username: string}[] | null>(null)

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
                    return
                }

                if(kicked && kicked === session.data?.user?.name) {
                    toast({
                        title: "You were removed from the room",
                        description: "You were kicked from the room by the room owner.",
                        variant: "destructive"
                    })
                    router.push("/")
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
            <div className="w-full grid grid-cols-2 p-4 gap-3 gap-y-2 bg-lightblue shadow-sm rounded mt-1">
            { players.map((item) => <div className="w-full h-full flex flex-col items-center" key={item.username}>
                <div className="bg-paleblue shadow-sm border border-b-blue-200 flex-1 w-full aspect-square rounded-md relative">
                    <User2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 text-lightblue"/>
                    {item.username === owner ? <Crown className="top-0 left-0 w-7 h-7 -translate-x-1.5 -translate-y-1.5 text-amber-400 -rotate-45" /> : null}
                    {session.data?.user?.name === owner && item.username !== owner ? 
                    <AlertDialog>
                    <AlertDialogTrigger>
                        <LogOut className="absolute top-1 right-1 w-5 h-5 cursor-pointer text-red-400" /> 
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
                    {item.username === currentTurn ? <Image alt="Cards icon" src='/cards.png' quality={100} width={52} height={52} className="absolute left-0 bottom-0 -translate-x-2.5 translate-y-2.5"/> : null}
                </div>
                <p className="text-lg font-medium text-gray-800">{item.username}</p>
            </div>)}
        </div>
        </div>
    )
}

export default Players