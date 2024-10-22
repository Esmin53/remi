import { cn } from "@/lib/utils"
import Image from "next/image"

interface TableProps {
    color?: string
    className?: string
}

const Table = ({color, className}: TableProps) => {
    let bg = color || "green.jpg"


    return (
        <div className={cn("w-7/12 max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center justify-center gap-4 cursor-pointer", className, {
            "border-red-500 border-2": true
        })} >
            <Image alt="Table pattern" fill src={`/table/${bg}`} className="-z-10" sizes="(max-width: 768px) 50vw, 100vw"/>
       </div>
    )
}

export default Table