import { ReactNode } from "react"


const TableOptions = ({children}: {children: ReactNode}) => {

    let bg = "/table/red.jpg"

    return (
        <div className="w-full  max-w-[850px] max-h-[600px] rounded-full relative overflow-hidden object-cover poker-table flex items-center
        justify-center gap-4" style={{backgroundImage: `url(${bg})`}}>
            {children}
       </div>
    )
}

export default TableOptions