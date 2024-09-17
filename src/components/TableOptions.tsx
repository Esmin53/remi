import { ReactNode, useEffect, useState } from "react"


const TableOptions = ({children}: {children: ReactNode}) => {

    let [bg, setBg] = useState("/table/red.jpg")

    useEffect(() => {
        typeof window !== "undefined" &&  setBg(localStorage.getItem("table") || "/table/red.jpg")
    }, [])

    return (
        <div className="w-8/12 sm:w-10/12 lg:w-full max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(${bg})`}}>
            {children}
       </div>
    )
}

export default TableOptions