"use client"


import { RoomCredentialsValidator, TRoomCredentialsValidator } from "@/lib/validators/room"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"

const NewRoomForm = () => {

    const {
        register,
        handleSubmit,
    } = useForm<TRoomCredentialsValidator>({
        resolver: zodResolver(RoomCredentialsValidator)
    })

    const router = useRouter()
    
    const onSubmit: SubmitHandler<TRoomCredentialsValidator> = async ({key, allowRandom}) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room`, {
                method: "POST",
                body: JSON.stringify({
                    key, 
                    allowRandom
                })
            })

            // DO ERROR HANDLING LATER
            if(response.status === 409) {
                console.log(409)
                return
            }

            const data = await response.json()

            
            const newRoomKey = data.newRoom[0].key

            if(response.ok === true) {
                router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${newRoomKey}`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form className="w-full py-2 pb-4 border-b-2 border-lightblue" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-medium py-2">Create new room</h1>
            <div className="w-full flex flex-col gap-2">
                <input type="text" className="w-full h-12 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm" 
                placeholder="Room key" {...register("key")}/>
                <div className="flex gap-2">
                    <input type="checkbox" {...register("allowRandom")}/>
                    <p>Allow random players to join your room</p>
                </div>
            <button className="w-full h-12 bg-peach hover:bg-peach/90 shadow rounded-sm font-medium flex items-center justify-center"
            type="submit">
                Create new room
            </button>
        </div>
      </form>
    )
}

export default NewRoomForm