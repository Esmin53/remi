import Image from "next/image"


const CardBack = () => {
    return (
        <div className="w-28 h-44 rounded-xl bg-[#4d4d4d] border-2 border-gray-700 relative overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-[#4d4d4d]"></div>
        <div className="absolute inset-0 bg-[#4d4d4d] opacity-25"></div>
            <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 relative">
                <Image fill alt="Cards icon" src='/cards.png'/>
            </div>
        </div>
    )
}

export default CardBack