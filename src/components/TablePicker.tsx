"use client"

import { useState } from "react"
import Table from "./Table"

const TablePicker = () => {
    const [currentTable, setCurrentTable] = useState(localStorage.getItem("table") || "/table/red.jpg")

    return (
        <div className="w-1/3 h-full flex flex-col gap-12 items-center justify-center overflow-hidden">
        <Table color={currentTable}/>
        <div className="flex w-full">
        <div onClick={() => {
            localStorage.setItem("table", "/table/green.jpg")
            setCurrentTable("/table/green.jpg")
        }} className="w-1/3 hover:-translate-y-1.5 duration-100">
            <Table color="/table/green.jpg" />
        </div>
        <div onClick={() => {
            localStorage.setItem("table", "/table/red.jpg")
            setCurrentTable("/table/red.jpg")
        }} className="w-1/3 hover:-translate-y-1.5 duration-100">
            <Table color="/table/red.jpg"/>
        </div>
        <div onClick={() => {
            localStorage.setItem("table", "/table/blue.jpg")
            setCurrentTable("/table/blue.jpg")
        }} className="w-1/3 hover:-translate-y-1.5 duration-100">
            <Table color="/table/blue.jpg"/>
        </div>


        </div>
      </div>
    )
}

export default TablePicker