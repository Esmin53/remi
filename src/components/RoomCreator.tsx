"use client"

import Image from "next/image";
import Table from "./Table";
import React, { Suspense, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Circle, CircleCheck, Loader2, X } from "lucide-react";
import DeckPreview from "./DeckPreview";
import { Switch } from "./ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import NewRoomForm from "./NewRoomForm";

const BACKGROUNDS = ["bg01.jpg", "bg02.jpg", "bg03.jpg", "bg04.jpg", "bg05.jpg", "bg06.jpg"];
const TABLES = ["red.jpg", "blue.jpg", "green.jpg", "purple.jpg", "dark_blue.jpg"]
const DECKS = ["white", "black"]

interface RoomCreatorProps {
    roomKey: string | null,
    currentBackground: string | null,
    currentTable: string | null,
    currentDeck: string | null,
    allowRandom: boolean | null
}

const RoomCreator = ({roomKey, currentBackground, currentTable, currentDeck, allowRandom}: RoomCreatorProps) => {
    const [background, setBackground] = useState(currentBackground || "bg06.jpg")
    const [table, setTable] = useState(currentTable || "red.jpg")
    const [deck, setDeck] = useState(currentDeck || "white")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAllowRandom, setIsAllowRandom] = useState(allowRandom || false)
    const [isUpdating, setIsUpdating] = useState(false)

    const {toast} = useToast()
    const router = useRouter()

    const updateRoom = async () => {
        if(isUpdating) return
        setIsUpdating(true)
        try {
            if(background === currentBackground &&
                table === currentTable &&
                deck === currentDeck && 
                isAllowRandom == allowRandom
            ) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${roomKey}/owner`, {
                method: "PATCH",
                body: JSON.stringify({
                    background,
                    table,
                    deck,
                    isAllowRandom
                })
            })

            if(response.ok) {
                toast({
                    title: "Room updated succesfully",
                    description: "Your room was succesfully updated.",
                    variant: "default"
                })
            }

        } catch (error) {
            toast({
                title: "Room updating failed",
                description: "Something went wrong and your room couldn't be updated. Please check your internet connection and try again.",
                variant: "destructive"
            })
        } finally {
            setIsUpdating(false)
        }
    }


    return (
        <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1 h-fit py-4 px-2 relative rounded-lg overflow-hidden flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold top-1 left-1.5 z-40 absolute">{roomKey}</h1>
                <Image alt="Background" fill src={`/background/${background}`}/>
                <Table className="md:w-11/12 lg:w-10/12 mx-auto" color={table}/>
                <DeckPreview deck={deck} />
            </div>
            <div className="w-full relative md:max-w-96 xl:max-w-xl  flex flex-col lg:p-2 lg:px-4 gap-2 justify-center items-center overflow-hidden">
            {isModalOpen ? <NewRoomForm background={background} table={table} deck={deck} /> : null}
            {isModalOpen ? <X className="fixed top-2 right-2 text-red-500 w-8 h-8 cursor-pointer z-[60]" onClick={() => setIsModalOpen(false)}/> : null}
            <div className="relative flex flex-col justify-center items-center h-fit  w-full rounded-lg overflow-hidden pb-20 sm:pb-24">
                <Carousel className="w-11/12 max-w-96 xl:max-w-xl" opts={{loop: true}}>
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

                <Carousel className="w-11/12 max-w-80 absolute bottom-2">
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
                    {BACKGROUNDS.map((item, index) => <CarouselItem className="basis-2/3 relative cursor-pointer" key={index} onClick={() => setBackground(item)}>
                            <div className="w-full aspect-video relative rounded-sm overflow-hidden">
                            <Image src={`/background/${item}`} fill alt="Background" loading="lazy"/>
                        </div>
                    </CarouselItem>)}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:block -left-4 w-9 h-9"/>
                <CarouselNext className="hidden sm:block -right-4 w-9 h-9"/>
            </Carousel>
            {roomKey ? <div className="flex gap-2 justify-start w-full py-1">
                     <Switch checked={isAllowRandom} onCheckedChange={() => setIsAllowRandom(prev => !prev)} /> 
                    <p>Allow random players to join your room</p>
                </div> : null}
            {
                roomKey ?
                <button className="w-full h-10 lg:h-12 bg-red-500 rounded-md font-medium lg:text-lg flex items-center justify-center" onClick={() => updateRoom()}>
                    {isUpdating ? <Loader2 className="animate-spin"/> : "Update Room"}
                </button> :
                <button className="w-full h-10 lg:h-12 bg-red-500 rounded-md font-medium lg:text-lg" onClick={() => setIsModalOpen(true)}>Create room</button>
                }
        </div>
        </div>
    )
}

export default React.memo(RoomCreator);