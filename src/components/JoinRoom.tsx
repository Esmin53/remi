"use client"

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { JoinRoomValidator, TJoinRoomValidator } from "@/lib/validators/join-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const JoinRoom = () => {

    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean >(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TJoinRoomValidator>({
        resolver: zodResolver(JoinRoomValidator)
    })

    const onSubmit: SubmitHandler<TJoinRoomValidator> = async ({ key }) => {
        setIsLoading(true)
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
            }

            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            toast({
                title: "Something went wrong!",
                description: "There was an error joining this room, please try again later.",
                variant: "destructive"
            })
        }
    }
    

    return (
        <div className="w-full bg-[#4d4d4d]/50 flex flex-col items-center justify-center p-2 gap-2 border-2 rounded-lg border-gray-700 shadow">
            <form className="w-full flex gap-2" onSubmit={handleSubmit(onSubmit)}>
            <input className={cn("w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm", {
                "border border-red-400": errors.key
            })}
            placeholder="Room key" {...register("key")}/>
            {errors?.key ? <p className="text-sm text-red-500 font-medium -mt-2">{errors.key.message}</p> : null}
            <button className="w-10 h-10 bg-red-500 hover:bg-red-500/90 shadow rounded-sm font-medium flex items-center justify-center"
                type="submit">
                {isLoading ? <Loader2 className="animate-spin"/> : <Check />}
            </button>
            </form>
        </div>
    )
}

export default JoinRoom