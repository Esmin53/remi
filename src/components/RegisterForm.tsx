"use client"

import { AuthCredentialsValidator, TAuthCredentialsValidator } from "@/lib/validators/auth"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const RegisterForm = () => {
    const [confirmPassword, setConfirmPassword] = useState<string >("")
    const [confirmPasswordError, setConfirmPasswordError] = useState<boolean >(false)
    const [isLoading, setIsLoading] = useState<boolean >(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator)
    })
    
    const onSubmit: SubmitHandler<TAuthCredentialsValidator> = async ({username, password}) => {
        try {
            if(confirmPassword !== watch("password")) {
                return
            }
            setIsLoading(true)
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/sign-up`, {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password
                })
            })

            const data = await response.json()
 
            if (data.success === true) {
                const res = await signIn("credentials", {username, password, redirect: false})
                
                if(res?.ok) {
                    setIsLoading(false)
                    router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/`)
                }
            }
            
        } catch (error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(watch("password") !== confirmPassword) {
            setConfirmPasswordError(true)
        } else {
            setConfirmPasswordError(false)
        }
    }, [confirmPassword])

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col">
                <label className="" htmlFor="username">Username</label>
                <input type="text" className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm
                " placeholder="Your username" {...register("username")}/>
                {errors.username ? <p className="text-sm font-medium text-red-400">{errors.username.message}</p> : null}
            </div>
            <div className="w-full flex flex-col">
                <label className="" htmlFor="username">Password</label>
                <input type="password" className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm
                " placeholder="Your password" {...register("password")}/>
                {errors.password ? <p className="text-sm font-medium text-red-400">{errors.password.message}</p> : null}
            </div>
            <div className="w-full flex flex-col">
                <label className="" htmlFor="username">Confirm Password</label>
                <input type="password" className="w-full h-10 px-2 rounded-sm bg-paleblue border-none outline-none text-gray-900 shadow-sm
                " placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                {confirmPasswordError ? <p className="text-sm font-medium text-red-400">Please make sure password and confirm password fields match!</p> : null}
            </div>
            <button className="w-full h-10 bg-peach hover:bg-peach/90 shadow rounded-sm font-medium flex items-center justify-center"
            disabled={isLoading} type="submit">
                {isLoading ? <Loader2 className="animate-spin"/>  : "Sign Up"}
            </button>
        </form>
    )
}

export default RegisterForm