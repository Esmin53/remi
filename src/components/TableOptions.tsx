import { ReactNode, useEffect, useState } from "react"


const TableOptions = ({children, table}: {children: ReactNode, table: string}) => {

    let [bg, setBg] = useState("red.jpg")


    return (
        <div className="w-full max-w-[850px] max-h-[600px] rounded-full relative object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(/table/${table})`}}>
            {children}
       </div>
    )
}

export default TableOptions