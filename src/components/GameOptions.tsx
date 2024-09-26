"use client"

import TablePicker from "./TablePicker";
import CardBack from "./CardBack";
import DeckPicker from "./DeckPicker";
import { useState } from "react";

const GameOptions = () => {
    const [showTable, setShowTable] = useState(false)

    return (
        <div className="w-full flex justify-center items-center overflow-hidden">
            <div className={`w-3/4 flex-shrink-0 ${showTable ? "-translate-x-2/4" : "translate-x-2/4"}`}>
                <TablePicker />
            </div>
            <div className={`h-full w-3/4 flex flex-shrink-0 ${showTable ? "-translate-x-2/4 justify-center items-center" : "translate-x-2/4"}`}>
                <DeckPicker />
            </div>
        </div>
    )
}

export default GameOptions;