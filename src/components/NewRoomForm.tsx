"use client"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { RoomCredentialsValidator, TRoomCredentialsValidator } from "@/lib/validators/room"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { title } from "process"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

const NewRoomForm = () => {

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<TRoomCredentialsValidator>({
        resolver: zodResolver(RoomCredentialsValidator)
    })
    const [isLoading, setIsLoading] = useState<boolean >(false)

    const { toast } = useToast()
    const router = useRouter()
    
    const onSubmit: SubmitHandler<TRoomCredentialsValidator> = async ({ key, allowRandom }) => {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key,
              allowRandom,
            }),
          });
      
          let data;
          try {
            data = await response.json();
          } catch (error) {
            data = { message: "An unexpected error occurred." };
          }
      
          if (!response.ok) {
            toast({
              title: "Room creation failed!",
              description: data.message || "Unable to create room.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
      
          toast({
            title: "Room created successfully!",
            description: "Room was created successfully, you will be redirected shortly.",
            variant: "default",
          });
      
          const newRoomKey = data.newRoom[0].key;
      
          router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${newRoomKey}`);
        } catch (error) {
          toast({
            title: "Room creation failed!",
            description: "Something went wrong and your room couldn't be created, please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <div className="absolute w-screen h-screen bg-[#4d4d4d]/85 top-0 left-0 z-50 flex items-center justify-center p-2 duration-75">
        <form className="w-full max-w-96 py-2 pb-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-medium py-2">Create new room</h1>
            <div className="h-0.5 w-3/4 bg-lightblue rounded-lg mb-2" />
            <div className="w-full flex flex-col gap-2">
                <input type="text" className={cn("w-full h-12 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm", {
                    "border border-red-500": errors.key
                })} 
                placeholder="Room key" {...register("key")}/>
                {errors?.key ? <p className="text-sm text-red-500 font-medium -mt-2">{errors.key.message}</p> : null}
                <div className="flex gap-2">
                    <input type="checkbox" {...register("allowRandom")}/>
                    <p>Allow random players to join your room</p>
                </div>
            <button className="w-full h-12 bg-red-500 hover:bg-red-500/90 shadow rounded-sm font-medium flex items-center justify-center"
            type="submit">
                {isLoading ? <Loader2 className="animate-spin"/> : "Create new room"}
            </button>
        </div>
      </form>
        </div>

    )
}

export default NewRoomForm