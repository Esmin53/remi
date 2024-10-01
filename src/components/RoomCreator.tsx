"use client"

import Image from "next/image";
import Table from "./Table";
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Circle, CircleCheck, Trash2, X } from "lucide-react";
import NewRoomForm from "./NewRoomForm";
import DeckPreview from "./DeckPreview";

const BACKGROUNDS = ["bg01.jpg", "bg02.jpg", "bg03.jpg", "bg04.jpg", "bg05.jpg", "bg06.jpg"];
const TABLES = ["red.jpg", "blue.jpg", "green.jpg", "purple.jpg", "dark_blue.jpg"]
const DECKS = ["black", "white"]

const RoomCreator = () => {
    const [background, setBackground] = useState("bg06.jpg")
    const [table, setTable] = useState("red.jpg")
    const [deck, setDeck] = useState("white")
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="w-full relative max-w-xl sm:min-h-[30rem] flex flex-col p-2 sm:px-4 gap-2 justify-center items-center bg-[#4d4d4d]/60 rounded-lg border-2 border-gray-700 shadow-lg overflow-hidden">
            {isModalOpen ? <NewRoomForm background={background} table={table} deck={deck}/> : null}
            {isModalOpen ? <X className="fixed top-2 right-2 text-red-500 w-8 h-8 cursor-pointer z-50" onClick={() => setIsModalOpen(false)}/> : null}
            <div className="relative flex flex-col justify-center items-center h-fit sm:min-h-96 w-full rounded-lg overflow-hidden pb-20 sm:pb-4">
                <Image fill alt="Background" src={`/background/${background}`}/>
                <Carousel className="w-11/12 sm:w-96">
                    <CarouselContent className="">
                    {TABLES.map((item, index) => <CarouselItem className="sm:w-96 relative" key={index} onClick={() => setTable(item)}>
                            {table === item ? 
                            <CircleCheck className="absolute left-1/2 -translate-x-1/2 w-12 sm:w-16 h-12 sm:h-16 z-50 top-1/2 -translate-y-1/2 cursor-pointer opacity-75" /> :
                            <Circle className="absolute left-1/2 -translate-x-1/2 w-12 sm:w-16 h-12 sm:h-16 z-50 top-1/2 -translate-y-1/2 cursor-pointer opacity-75" />}
                            <Table className="w-11/12 sm:w-10/12 mx-auto" color={item}/>
                        </CarouselItem>)}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:block left-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10"/>
                    <CarouselNext className="hidden sm:block right-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10"/>
                </Carousel>

                <Carousel className="w-11/12 sm:w-80 absolute bottom-2">
                    <CarouselContent className="">
                    {DECKS.map((item, index) => <CarouselItem key={index} onClick={() => setDeck(item)}>
                        <DeckPreview deck={item} chosenDeck={deck} />
                        </CarouselItem>)}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:block -left-2 w-9 h-9 bg-gray-200/60 text-gray-800 border-gray-200/50 shadow hover:bg-gray-200/80"/>
                    <CarouselNext className="hidden sm:block -right-2 w-9 h-9 bg-gray-200/60 text-gray-800 border-gray-200/50 shadow hover:bg-gray-200/80"/>
                </Carousel>
                
            </div>
            <Carousel className="w-11/12">
                    <CarouselContent className="w-full">
                    {BACKGROUNDS.map((item, index) => <CarouselItem className="basis-2/3 sm:basis-1/3 relative cursor-pointer" key={index} onClick={() => setBackground(item)}>
                            <div className="w-full aspect-video relative rounded-sm overflow-hidden">
                            <Image src={`/background/${item}`} fill alt="Background"/>
                            </div>
                        </CarouselItem>)}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:block -left-4 w-9 h-9"/>
                    <CarouselNext className="hidden sm:block -right-4 w-9 h-9"/>
                </Carousel>
            <button className="w-full h-10 sm:h-12 bg-red-500 rounded-md font-medium sm:text-lg" onClick={() => setIsModalOpen(true)}>Create room</button>
        </div>
    )
}

export default RoomCreator;