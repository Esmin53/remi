import CardBack from "./CardBack"


const CardBundle = ({deck}: {deck: string}) => {

    return (
            <div className="relative w-fit">
                <CardBack deck={deck} className="border-red-500 shadow-red-glow h-14 w-[2.47rem] sm:h-24 sm:w-[4.24rem] md:h-32 md:w-[5.65rem] lg:h-36 lg:w-[6.35rem] absolute" />
                <CardBack deck={deck} className="border-red-500 shadow-red-glow h-14 w-[2.47rem] sm:h-24 sm:w-[4.24rem] md:h-32 md:w-[5.65rem] lg:h-36 lg:w-[6.35rem] absolute rotate-6" />
                <CardBack deck={deck} className="border-red-500 shadow-red-glow h-14 w-[2.47rem] sm:h-24 sm:w-[4.24rem] md:h-32 md:w-[5.65rem] lg:h-36 lg:w-[6.35rem] absolute rotate-12" />
                <CardBack deck={deck} className="border-red-500 shadow-red-glow h-14 w-[2.47rem] sm:h-24 sm:w-[4.24rem] md:h-32 md:w-[5.65rem] lg:h-36 lg:w-[6.35rem] absolute rotate-45" />
                <CardBack deck={deck} className="border-red-500 shadow-red-glow h-14 w-[2.47rem] sm:h-24 sm:w-[4.24rem] md:h-32 md:w-[5.65rem] lg:h-36 lg:w-[6.35rem] -rotate-12" />
            </div>
    ) 
}

export default CardBundle