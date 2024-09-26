import { ReactNode, useEffect, useState } from "react"


const TableOptions = ({children}: {children: ReactNode}) => {

    let [bg, setBg] = useState("/table/red.jpg")

    useEffect(() => {
        typeof window !== "undefined" &&  setBg(localStorage.getItem("table") || "/table/red.jpg")
    }, [])

    return (
        <div className="w-full max-w-[850px] max-h-[600px] rounded-full relative object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(${bg})`}}>
            {children}
       </div>
    )
}

export default TableOptions