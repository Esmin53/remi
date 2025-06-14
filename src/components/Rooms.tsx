"use client"

import Image from "next/image";
import JoinRoom from "./JoinRoom";
import Table from "./Table";
import { useEffect, useState } from "react";
import { JoinRoomValidator, TJoinRoomValidator } from "@/lib/validators/join-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCcw } from "lucide-react";

const Rooms = () => {
    const [rooms, setRooms] = useState< {
        key: string,
        background: string,
        table: string
    }[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TJoinRoomValidator>({
        resolver: zodResolver(JoinRoomValidator)
    })

    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isJoining, setIsJoining] = useState(false)

    const getRooms = async () => {
        if(isLoading) return
        setIsLoading(true)
        setRooms([])
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms`)

            const data: {
                key: string,
                background: string,
                table: string
            }[] = await response.json()

            setRooms(data)

        } catch (error) {
            toast({
                title: "Something went wrong.",
                description: "There was an error finding rooms, please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }



    const onSubmit: SubmitHandler<TJoinRoomValidator> = async ({ key }) => {
        setIsJoining(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`, {
                method: 'PUT',
                body: JSON.stringify({key})
            })

            const data = await response.json();

            if(response.status === 403) {
                toast({
                    title: "Room is full!",
                    description: "You can't join this room right now becouse it is full, please try again later.",
                    variant: "destructive"
                })
            } else if(response.status === 404) {
                toast({
                    title: "No such room!",
                    description: "Room with that key doesnt exist, please try again.",
                    variant: "destructive"
                })
            } else if(response.status === 423) {
                toast({
                    title: "Game in progress!",
                    description: "You can't join this room rigth now becouse there is a game in progress, please try again later.",
                    variant: "destructive"
                })
            }

            if(data.key) {
                router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${data.key}`)
                router.refresh()
            } else {
                setIsJoining(false)
            }

        } catch (error) {
            setIsJoining(false)
            toast({
                title: "Something went wrong!",
                description: "There was an error joining this room, please try again later.",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        getRooms()
    }, [])



    return (
        <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 lg:w-1/3 lg:min-w-96 max-w-xl h-fit flex flex-col md:sticky md:top-12">
                <h1 className="text-2xl lg:text-3xl font-semibold">Join your friends.</h1>
                <p className="text-base">Enter a room key and join a room.</p>
                <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
                <JoinRoom />
            </div>
        <div className="flex-1 bg-gray-900/20 shadow-sm rounded-lg border border-gray-900/25 p-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Find a room.</h1>
                    <p className="text-base">Join a room and start playing now.</p>
                </div>
                <button onClick={getRooms}>
                    <RefreshCcw className="w-7 h-7 font-medium mr-2" />
                </button>
            </div>
            <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
            {!isLoading && rooms.length !== 0 ? <div className="flex-1 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 relative">
                {!isJoining ?  rooms.map(({key, background, table}) => (
                        <div className=" p-1 h-fit" key={key}>
                        <div className="w-full aspect-video relative rounded-sm overflow-hidden flex items-center justify-center">
                            <Image fill alt="Table" src={`/background/${background}`} loading="lazy" sizes="(max-width: 634px) 100vw, 40vw" />
                            <Table  color={table}className="w-9/12">
                
                            </Table>
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <h2 className="text-lg font-medium p-2">{key}</h2>
                            <form onSubmit={(e) => { 
                            setIsJoining(true)
                            e.preventDefault(); 
                            onSubmit({ key }); 
                        }}>
                            <button className="cursor-pointer" type="submit">
                                Join
                            </button>
                            </form>
                        </div>
                    </div>
                )) : null}
            </div> : null}
            {isLoading && rooms.length === 0 ? <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                <h2 className="text-2xl font-medium">Finding rooms</h2>
                <Loader2 className="animate-spin w-12 h-12" />
            </div> : null} 
            {isJoining ? <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                <h2 className="text-2xl font-medium">Joining room</h2>
                <Loader2 className="animate-spin w-12 h-12" />
            </div> : null} 
            {!isLoading && rooms.length === 0 ? <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                <h2 className="text-2xl font-medium">There are no active rooms. Please try again later</h2>
            </div> : null} 
        </div>
        </div>
    )
}

export default Rooms;