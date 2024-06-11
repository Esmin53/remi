import Image from "next/image"
import CardBack from "./CardBack"
import CardFront from "./CardFront"


const Table = () => {
    return (
        <div className="w-10/12 aspect-video rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4">
            <div className="w-28 h-44 rounded relative">
                <Image alt="Card" fill src={"/png/black/clovers_2_black.png"} />
            </div>
           <CardBack />
       </div>
    )
}

export default Table