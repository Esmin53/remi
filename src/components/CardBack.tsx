import { cn } from "@/lib/utils"
import Image from "next/image"

const CardBack = ({className, deck}: {className?: string, deck?: string}) => {

    return (
        <div className={cn("w-[3.1rem] h-[4.4rem] sm:w-[4.2rem] sm:h-24 md:w-[7.04rem] lg:w-32  md:h-40 lg:h-44 rounded-sm sm:rounded-lg lg:rounded-xl border sm:border-2  relative overflow-hidden cursor-pointer", {
            "border-gray-700 bg-[#4d4d4d]": deck === "black",
            "border-gray-400 bg-[#ffffff]": deck === "white"
        }, className)}>
        <div className={cn("absolute inset-0", {
            "bg-[#4d4d4d]": deck === "black",
            "bg-[#ffffff]": deck === "white"
        })}></div>
        <div className={cn("absolute inset-0 opacity-25", {
            "bg-[#4d4d4d]": deck === "black",
            "bg-[#ffffff]": deck === "white"
        })}></div>
            <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative">
                <Image fill alt="Cards icon" src='/cards.png' quality={100}/>
            </div>
        </div>
    )
}

export default CardBack