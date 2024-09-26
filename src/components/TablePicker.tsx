"use client"

import { useEffect, useState } from "react"
import Table from "./Table"

const TablePicker = () => {
    const [currentTable, setCurrentTable] = useState("/table/red.jpg")

    useEffect(() => {
        typeof window !== "undefined" &&  setCurrentTable(localStorage.getItem("table") || "/table/red.jpg")
    }, []) 

    return (
        <div className="flex-1 w-full flex flex-col  items-center justify-center overflow-hidden max-w-96">
        <div className="w-full aspect-video flex justify-center ">
            <Table color={currentTable}/>
        </div>
        <div className="flex sm:grid sm:grid-flow-col sm:grid-cols-3 w-full overflow-x-auto px-2 no-scrollbar">
        <div onClick={() => {
            localStorage.setItem("table", "/table/green.jpg")
            setCurrentTable("/table/green.jpg")
        }} className="flex-shrink-0 w-4/6 sm:w-full hover:-translate-y-1.5 duration-100">
            <Table color="/table/green.jpg" />
        </div>
        <div onClick={() => {
            localStorage.setItem("table", "/table/red.jpg")
            setCurrentTable("/table/red.jpg")
        }} className="flex-shrink-0 w-4/6 sm:w-full hover:-translate-y-1.5 duration-100">
            <Table color="/table/red.jpg"/>
        </div>
        <div onClick={() => {
            localStorage.setItem("table", "/table/blue.jpg")
            setCurrentTable("/table/blue.jpg")
        }} className="flex-shrink-0 w-4/6 sm:w-full hover:-translate-y-1.5 duration-100">
            <Table color="/table/blue.jpg"/>
        </div>

        </div>
      </div>
    )
}

export default TablePicker