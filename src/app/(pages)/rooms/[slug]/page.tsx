"use client"

import CardBack from "@/components/CardBack"
import CardBundle from "@/components/CardBundle"
import MyHand from "@/components/MyHand"
import Table from "@/components/Table"
import TableOptions from "@/components/TableOptions"
import GameMenu from "@/components/gamemenu/GameMenu"
import { CARDS, Card } from "@/lib/cards"
import { pusherClient } from "@/lib/pusher"
import { getCards, toPusherKey } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const page = () => {

    const session = useSession()

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCards, setSelectedCards] = useState<Card[]>([])
    const [cardToDraw, setCardToDraw] = useState<Card | null>(null)
    const [lastDiscartedCard, setLastDiscartedCard] = useState<Card | null>(null)
    const [cards, setCards] = useState<Card[] >([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasDiscarted, setHasDiscarted] = useState(true)
    const [hasDrew, setHasDrew] = useState(false)
    const [roomData, setRoomData] = useState<{
        owner: string
        gameId: string | null
        gameStatus: string | null
        currentTurn: string | null
    }>({
        owner: "",
        gameId: null,
        gameStatus: null ,
        currentTurn: null
    })

    const key = usePathname().split("/")[2]
    const router = useRouter()

    const getRoomInfo = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}`)

            const data = await response.json()

            
            setRoomData({
                owner: data.owner,
                gameId: data.gameId || null,
                gameStatus: data.gameStatus || null,
                currentTurn: data.currentTurn || null
            })

            if(data.gameStatus === "IN_PROGRESS") {
                let card = CARDS.find(item => item.id === data.deck)
                setCardToDraw(card!)
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }


    const startGame = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, {
                method: "POST",
                body: JSON.stringify({
                    key
                })
            })

            const data = await response.json()

            console.log("Start Game Data: ", data)
        } catch (error) {
            console.log(error)
        }
    }

    const getMyCards = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${key}/hand`)

            const data = await response.json()


            if(data.discardedCard) {
                let card = CARDS.find(item => item.id === data.discardedCard)
                setLastDiscartedCard(card!)
            }

            await setCardIds(data.cards)
            await setCards(getCards(data.cards))

        } catch (error) {
            console.log(error)
        }
    }

    const selectCard = (card: Card) => {
        if (selectedCards.find(item => item.id === card.id)) {
            setSelectedCards(prevSelected => prevSelected.filter(item => item.id !== card.id));
        } else {
            setSelectedCards(prevSelected => [...prevSelected, card]);
        }
    };

    const drawCard = () => {
        if(roomData.currentTurn !== session.data?.user?.name) return
        
        if(hasDrew) {
            console.log("Already drew card this turn!")
            return
        }
        
        if(cards.length >= 15) {
            console.log("Problem")
            return
        }

        setHasDrew(true)

        //let newCard = cardToDraw.pop()

        //console.log("New Card", newCard)

        if(cardToDraw)
        setCards([...cards, cardToDraw])

    }

    const discardCard = async () => {
        if(hasDiscarted) {
            console.log("Ne moze postar")
            return
        }

        if(selectedCards.length > 1) {
            return
        }

        if(!selectedCards.length || cards.length === 14) {
            return
        }

        setHasDiscarted(true)
        //cardToDraw.unshift(selectedCards[0])
        setLastDiscartedCard(selectedCards[0])
        setCards(cards.filter(item => item.id !== selectedCards[0].id))
        setSelectedCards(selectedCards.filter((item => item.id !== selectedCards[0].id)))  


        const filteredIds = cards
        .filter((item) => item.id !== selectedCards[0].id)
        .map((item) => item.id);
        
        try { 
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, {
                method: "PUT",
                body: JSON.stringify({
                    id: roomData.gameId,
                    discartedCard: selectedCards[0].id,
                    newHand:filteredIds
                })
            })
    
            const data = await response.json()

            console.log("Turn Card Data: ", data)

        } catch (error) {
            
        }
    }

    const leaveTable = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players`, {
                method: "DELETE"
            });

            const data = await response.json()

            if(data.ok && response.status === 200) {
                router.push("/");
            }

            console.log("Leave table data ---> ", data)
        } catch (error) {
            
        }
    }

    const swapCards = () => {
        if (selectedCards.length > 2 || selectedCards.length < 1) {
             return
        }

        if(!cards[0]?.id || !cards[1]?.id) return
        const index1 = cards.findIndex(card => card.id === selectedCards[0].id);
        const index2 = cards.findIndex(card => card.id === selectedCards[1].id);

        if (index1 === -1 || index2 === -1) {
            console.error('One or both cards not found in the array');
            return;
        }

        const newCards = [...cards];

        [newCards[index1], newCards[index2]] = [newCards[index2], newCards[index1]];

        setCards(newCards);
        setSelectedCards(selectedCards.filter((item => item.id !== selectedCards[0].id)))
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`game:${key}:turn`))
        
            const turnHandler = (data: {cardToDraw: number, currentTurn: string, gameStatus?: string, 
                gameId?: string, discartedCard?: number}) => {
                
                console.log("Called")
                if(data.gameStatus) {
                    console.log(data.gameStatus)
                    setRoomData(prev => ({
                        ...prev,
                        gameStatus: data.gameStatus!
                    }))
                }

                if(data.gameId) {
                    setRoomData(prev => ({
                        ...prev,
                        gameId: data.gameId!
                    }))
                }


                if(data.gameStatus === "IN_PROGRESS") {
                    let card = CARDS.find(item => item.id === data.cardToDraw)
                    setCardToDraw(card!)
                    setRoomData(prev => ({
                        ...prev,
                        currentTurn: data.currentTurn
                    }))
                }

                if(data.discartedCard) {
                    let card = CARDS.find(item => item.id === data.discartedCard)
                    setLastDiscartedCard(card!)
                }
            }
    
        pusherClient.bind(`game-turn`, turnHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`game:${key}:turn`))
            pusherClient.unbind('game-turn', turnHandler)
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        getRoomInfo()
    }, [])

    useEffect(() => {
        if(roomData.currentTurn === session.data?.user?.name) {
            setHasDiscarted(false)
            setHasDrew(false)
        }
    }, [roomData.currentTurn])

    if(isLoading || session.status === "loading") {
        return <div className="w-screen h-screen flex items-center justify-center">
            <CardBack className="animate-pulse xl:w-32" />
        </div>
    }

    return (
        <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center flex-col pt-6 relative justify-evenly">
                <div className="flex-1 w-full flex justify-center items-center relative">
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full top-2"></div>
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full right-8"></div>
                    <div className="w-24 h-24 bg-paleblue shadow-sm border-2 border-lightblue absolute rounded-full left-8"></div>
                    {roomData?.gameStatus === 'IN_PROGRESS' ? <TableOptions>
                    {roomData.gameStatus != "IN_PROGRESS" && roomData.owner === session.data?.user?.name ? <button className="w-32 h-12 rounded-lg bg-peach cursor-pointer z-40" >
                        Start Game
                    </button> : <>
                    <div className="w-14 sm:w-16 md:w-24 lg:w-28 h-24 sm:h-32 md:h-40 lg:h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative" onClick={() => discardCard()}>
                        {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
                    </div>
                    <div onClick={() => drawCard()}>
                        <CardBack />
                    </div>
                    </>}
            
                    {roomData.gameStatus === "IN_PROGRESS"  && cards.length === 0 && <div className="absolute bottom-2" 
                    onClick={() => getMyCards()}>
                        <CardBundle />
                    </div>}
                </TableOptions> : <TableOptions>
                        {session.data?.user?.name === roomData?.owner ? <h1 className="text-3xl font-semibold cursor-pointer z-40"
                        onClick={() => startGame()}>
                            Start a new game
                        </h1> : <h1 className="text-3xl font-semibold">Waiting for room owner</h1>}
                    </TableOptions>}
                </div>
                {cardIds?.length ? <MyHand 
                    selectedCards={selectedCards}
                    cards={cards} 
                    selectCard={selectCard}/> : null}
                <div className="w-full h-12 bg-[#486581] mt-auto flex items-center justify-center gap-5">
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => leaveTable()}>Leave</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => swapCards()}>Swap</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => drawCard()}>Draw</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => discardCard()}>Discard</p>
                </div>
            </div>
            <GameMenu />
        </div>
    )
}

export default page