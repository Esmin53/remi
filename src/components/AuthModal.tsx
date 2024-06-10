"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

const AuthModal = () => {
    const [showLogin, setShowLogin] = useState<boolean >(true)

    return (
        <div className="flex flex-col w-full sm:max-w-80 lg:max-w-96 gap-2">
        <div className="w-full h-10 rounded-md flex gap-1 justify-between items-center">
            <h2 className="text-2xl xs:text-3xl font-medium">{showLogin ? "Sign In" : "Sign Up"}</h2>
            <div className="flex w-32 h-7 sm:w-44 sm:h-9 bg-[#bcccdc] rounded-full">
                <div className={cn("rounded-full text-xs sm:text-sm flex items-center justify-center w-[45%] font-medium cursor-pointer duration-100", {
                    "w-[55%] bg-peach": showLogin
                })} onClick={() => setShowLogin(true)}>
                    Login
                </div>
                <div className={cn("rounded-full text-xs sm:text-sm flex items-center justify-center w-[45%] font-medium cursor-pointer duration-100", {
                    "w-[55%] bg-peach": !showLogin
                })} onClick={() => setShowLogin(false)}>
                    Register
                </div>
            </div>
        </div>
        {showLogin ? (
            <LoginForm />
        ) : (
            <RegisterForm />
        )}
    </div>
    )
}

export default AuthModal;