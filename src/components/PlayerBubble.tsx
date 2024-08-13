import { cn } from "@/lib/utils"
import { User2 } from "lucide-react";


const PlayerBubble = ({
    className,
    playerName}: {
        className?: string,
        playerName: string
    }) => {

    return (
        <div className={cn("w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 z-30 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full flex items-end justify-center", className)}>
            <div className="relative w-full h-full rounded-full flex justify-center items-center">
                <User2 className="text-lightblue w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <p className="text-gray-900 font-medium text-xl z-20 absolute -bottom-6">{playerName}</p>
            </div>
        </div>
    )
}


export default PlayerBubble;