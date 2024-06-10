"use client"

import { AuthCredentialsValidator, TAuthCredentialsValidator } from "@/lib/validators/auth"
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react"

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState<boolean >(false)

    const {
        register,
        handleSubmit,
    } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator)
    })
    
    const router = useRouter()

    const onSubmit: SubmitHandler<TAuthCredentialsValidator> = async ({username, password}) => {
        setIsLoading(true)
        try {
            const res = await signIn("credentials", {username, password, redirect: false})
            
            if(res?.ok) {
                setIsLoading(false)
                router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/`)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    
    return (
        <form className="w-full flex flex-col gap-4 animate-slide-in" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col">
                <label className="" htmlFor="username">Username</label>
                <input type="text" className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm
                " placeholder="Your username" {...register("username")}/>
            </div>
            <div className="w-full flex flex-col">
                <label className="" htmlFor="username">Password</label>
                <input type="password" className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm
                " placeholder="Your password" {...register("password")}/>
            </div>
            <button className="w-full h-10 bg-peach hover:bg-peach/90 shadow rounded-sm font-medium flex items-center justify-center"
            disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/>  : "Sign In"}
            </button>
        </form>
    )
}

export default LoginForm