import CardBack from "./CardBack"


const CardBundle = () => {

    return (
            <div className="relative w-fit">
                <CardBack className="border-red-500 shadow-red-glow w-10 sm:w-12 md:w-20 lg:w-24 h-16 sm:h-24 md:h-32 lg:h-36 absolute" />
                <CardBack className="border-red-500 shadow-red-glow w-10 sm:w-12 md:w-20 lg:w-24 h-16 sm:h-24 md:h-32 lg:h-36 absolute rotate-6" />
                <CardBack className="border-red-500 shadow-red-glow w-10 sm:w-12 md:w-20 lg:w-24 h-16 sm:h-24 md:h-32 lg:h-36 absolute rotate-12" />
                <CardBack className="border-red-500 shadow-red-glow w-10 sm:w-12 md:w-20 lg:w-24 h-16 sm:h-24 md:h-32 lg:h-36 absolute rotate-45" />
                <CardBack className="border-red-500 shadow-red-glow w-10 sm:w-12 md:w-20 lg:w-24 h-16 sm:h-24 md:h-32 lg:h-36 -rotate-12" />
            </div>
    ) 
}

export default CardBundle