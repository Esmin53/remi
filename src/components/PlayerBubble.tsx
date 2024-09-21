import { cn } from "@/lib/utils"
import { User2 } from "lucide-react";
import Image from "next/image";


const PlayerBubble = ({
    className,
    avatar,
    playerName}: {
        className?: string,
        playerName: string
        avatar: string | null
    }) => {

    return (
        <div className={cn("w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 z-30 bg-paleblue shadow-sm border sm:border-2 border-lightblue absolute rounded-full flex items-end justify-center", className)}>
            <div className="relative w-full h-full rounded-full flex justify-center items-center">
                {avatar ? <Image fill alt="Avatar" src={`/avatar/${avatar}`} className="rounded-full object-center" /> : null}
                <User2 className="text-lightblue w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <p className="text-white font-medium text-xs sm:text-xl z-20 absolute -bottom-2">{playerName}</p>
            </div>
        </div>
    )
}


export default PlayerBubble;