"use client"

import { JoinRoomValidator, TJoinRoomValidator } from "@/lib/validators/join-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const JoinRoom = () => {

    const router = useRouter()
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

            if(response.status === 404) {
                console.log(response.status)
            }

            const data = await response.json();

            setIsLoading(false)
            if(data.key) {
                router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${data.key}`)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    

    return (
        <div className="absolute w-screen h-screen bg-[#4d4d4d]/85 top-0 left-0 z-50 flex items-center justify-center p-2 duration-75">
            <form className="w-full flex flex-col gap-2 max-w-96" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-xl font-medium">Find a new room</p>
            <div className="h-0.5 w-3/4 bg-lightblue rounded-lg" />
            <input className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm"
            placeholder="Room key" {...register("key")}/>
            <button className="w-full h-10 bg-red-500 hover:bg-red-500/90 shadow rounded-sm font-medium flex items-center justify-center"
                type="submit">
                {isLoading ? <Loader2 className="animate-spin"/> : "Join room"}
            </button>
            </form>
        </div>
    )
}

export default JoinRoom