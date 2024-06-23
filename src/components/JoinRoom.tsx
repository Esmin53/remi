"use client"

import { JoinRoomValidator, TJoinRoomValidator } from "@/lib/validators/join-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const JoinRoom = () => {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TJoinRoomValidator>({
        resolver: zodResolver(JoinRoomValidator)
    })

    const onSubmit: SubmitHandler<TJoinRoomValidator> = async ({ key }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`, {
                method: 'PUT',
                body: JSON.stringify({key})
            })

            if(response.status === 404) {
                console.log(response.status)
            }

            const data = await response.json();


            if(data.key) {
                router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${data.key}`)
            }

        } catch (error) {
            console.log(error)
        }
    }
    

    return (
        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl font-medium">Find a new room</p>
        <div className="h-0.5 w-3/4 bg-lightblue rounded-lg" />
        <input className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm"
        placeholder="Room key" {...register("key")}/>
        <button className="w-full h-10 bg-peach hover:bg-peach/90 shadow rounded-sm font-medium flex items-center justify-center"
        type="submit">
        Join room
    </button>
    </form>
    )
}

export default JoinRoom