import { cn } from "@/lib/utils"
import Image from "next/image"


interface DeckPreviewProps {
    deck: string
    chosenDeck?: string
}

const DeckPreview = ({chosenDeck, deck}: DeckPreviewProps) => {

    return (
        <div className="flex justify-center">
            <div className={cn(" w-[3.2rem] h-[4.5rem] sm:w-[4.2rem] sm:h-24 relative shadow cursor-pointer rounded-lg border-2", {
                "border-gray-700": deck === "black",
                "border-gray-200": deck === "white",
                "border-red-500": chosenDeck === deck,
            })}>
                <Image fill alt="" src={`/cards/${deck}/Pikes_A.png`} />
            </div>
            <div className={cn("-ml-6 w-[3.2rem] h-[4.5rem] sm:w-[4.2rem] sm:h-24 relative shadow cursor-pointer rounded-lg border-2 border-gray-700", {
                "border-gray-700": deck === "black",
                "border-gray-200": deck === "white",
                "border-red-500": chosenDeck === deck,
            })}>
                <Image fill alt="" src={`/cards/${deck}/Hearts_A.png`} />
            </div>
            <div className={cn("-ml-6 w-[3.2rem] h-[4.5rem] sm:w-[4.2rem] sm:h-24 relative shadow cursor-pointer rounded-lg border-2 border-gray-700", {
                "border-gray-700": deck === "black",
                "border-gray-200": deck === "white",
                "border-red-500": chosenDeck === deck,
            })}>
                <Image fill alt="" src={`/cards/${deck}/Clovers_A.png`} />
            </div>
            <div className={cn("-ml-6 w-[3.2rem] h-[4.5rem] sm:w-[4.2rem] sm:h-24 relative shadow cursor-pointer rounded-lg border-2 border-gray-700", {
                "border-gray-700": deck === "black",
                "border-gray-200": deck === "white",
                "border-red-500": chosenDeck === deck,
            })}>
                <Image fill alt="" src={`/cards/${deck}/Tiles_A.png`} />
            </div>
        </div>
    )
}

export default DeckPreview