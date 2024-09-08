"use client"

import CardBack from "@/components/CardBack"
import CardBundle from "@/components/CardBundle"
import LoadingHand from "@/components/LoadingHand"
import MeldArea from "@/components/MeldArea"
import MyHand from "@/components/MyHand"
import PlayerBubble from "@/components/PlayerBubble"
import TableOptions from "@/components/TableOptions"
import GameMenu from "@/components/gamemenu/GameMenu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { meld } from "@/db/schema"
import { CARDS, Card } from "@/lib/cards"
import { pusherClient } from "@/lib/pusher"
import { allUniqueSymbols, areCardsSequential, cn, getCards, toPusherKey } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Meld = typeof meld.$inferSelect;

type GroupedMelds = {
    [playerName: string]: Meld[];
  };

const page = () => {

    const session = useSession()

    const [cardIds, setCardIds] = useState<number[] >([])
    const [selectedCards, setSelectedCards] = useState<Card[]>([])
    const [cardToDraw, setCardToDraw] = useState<Card | null>(null)
    const [lastDiscartedCard, setLastDiscartedCard] = useState<Card | null>(null)
    const [cards, setCards] = useState<Card[] >([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasDrew, setHasDrew] = useState(false)
    const [players, setPlayers] = useState<string[] >([])
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
    const [melds, setMelds] = useState<GroupedMelds >({})
    const [isFetching, setIsFetching] = useState(false)

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

            setPlayers(data.players)

            if(data.gameStatus === "IN_PROGRESS") {
                let card = CARDS.find(item => item.id === data.deck)
                setCardToDraw(card!)
                setHasDrew(data.hasDrew)
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }


    const startGame = async () => {
        if(isFetching) return
        setIsFetching(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game`, {
                method: "POST",
                body: JSON.stringify({
                    key
                })
            })

            const data = await response.json()

            console.log("Start Game Data: ", data)
            setIsFetching((prev) => false)
        } catch (error) {
            console.log(error)
        }
    }

    const getMyCards = async () => {
        setIsFetching(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${key}/hand`)

            const data = await response.json()



            if(data.discardedCard) {
                let card = CARDS.find(item => item.id === data.discardedCard)
                setLastDiscartedCard(card!)
            }

            await setCardIds(data.cards)
            await setCards(getCards(data.cards))

            setIsFetching((prev) => false)
        } catch (error) {
            console.log(error)
            setIsFetching((prev) => false)
        }
    }

    const selectCard = (card: Card) => {
        if (selectedCards.find(item => item.id === card.id)) {
            setSelectedCards(prevSelected => prevSelected.filter(item => item.id !== card.id));
        } else {
            setSelectedCards(prevSelected => [...prevSelected, card]);
        }
    };

    const drawCard = async () => {
        if(roomData.currentTurn !== session.data?.user?.name) return
        
        if(hasDrew) {
            console.log("Already drew card this turn!")
            return
        }
        
        if(cards.length >= 15) {
            console.log("Problem")
            return
        }

        if(isFetching) return
        setIsFetching(true)

        const filteredIds = cards.map((item) => item.id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${roomData.gameId}/draw`, {
            method: "PUT",
            body: JSON.stringify({
                hand:filteredIds,
            })
        })

        const data = await response.json()

        let [newCard] = getCards(data.cardToDraw)
        setHasDrew(true)

        console.log("Data: ", data)

        if(cardToDraw)
        setCards([...cards, newCard])
        setCardToDraw(null)

        setIsFetching((prev) => false)
    }

    const discardCard = async () => {
        if(!hasDrew && !selectedCards.length && lastDiscartedCard) {
            console.log("Testiramo malo")
            setCards([...cards, lastDiscartedCard])
            setHasDrew(true)
            setLastDiscartedCard(null)
            setIsFetching((prev) => false)
            return
        }
        
        if(!hasDrew) {
            console.log("Ne moze postar")
            setIsFetching(false)
            return
        }

        if(selectedCards.length > 1) {
            return
        }

        if(!selectedCards.length || cards.length === 14) {
            return
        }
        setIsFetching((prev) => true)

        //cardToDraw.unshift(selectedCards[0])
        setLastDiscartedCard(selectedCards[0])
        setCards(cards.filter(item => item.id !== selectedCards[0].id))
        setSelectedCards(selectedCards.filter((item => item.id !== selectedCards[0].id)))  


        const filteredIds = cards
        .filter((item) => item.id !== selectedCards[0].id)
        .map((item) => item.id);
        
        try { 
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${roomData.gameId}/discard`, {
                method: "PUT",
                body: JSON.stringify({
                    id: roomData.gameId,
                    discartedCard: selectedCards[0].id,
                    newHand:filteredIds,
                    cardToDraw: cardToDraw
                })
            })
    
            const data = await response.json()

            setIsFetching((prev) => false)

        } catch (error) {
            setIsFetching((prev) => false)
        }
    }

    const leaveTable = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players?gameId=${roomData.gameId}&gameStatus=${roomData.gameStatus}`, {
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

    const meldCards = async () => {
        if(isFetching || roomData.currentTurn !== session.data?.user?.name) return
        setIsFetching(true)
        let cardIds = selectedCards.map((item) => item.id).sort((a, b) => a - b);
        if(selectedCards.every((card) => card.symbol === selectedCards[0].symbol)) {
            if(areCardsSequential(selectedCards)) {
                try {
                
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${key}/meld`, {
                        method: "POST",
                        body: JSON.stringify({
                            cardIds,
                            gameId: roomData.gameId,
                            key: key
                        })
                    })
    
                    const data = await response.json()
    
                    const filteredCards = cards?.filter(card => !cardIds.includes(card.id))
                    setCards(filteredCards)
                    setSelectedCards([])
    
                    setIsFetching((prev) => false)

                } catch (error) {
                    console.log(error)
                    setIsFetching((prev) => false)
                }
            } else {
                setIsFetching((prev) => false)
                return
            }

            

        } else if(selectedCards.every((card) => card.value === selectedCards[0].value) && allUniqueSymbols(selectedCards)) {
            try {
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${key}/meld`, {
                    method: "POST",
                    body: JSON.stringify({
                        cardIds,
                        gameId: roomData.gameId,
                        key: key
                    })
                })

                const data = await response.json()

                const filteredCards = cards?.filter(card => !cardIds.includes(card.id))
                setCards(filteredCards)
                setSelectedCards([])

                setIsFetching((prev) => false)
            } catch (error) {
                setIsFetching((prev) => false)
                console.log(error)
            }

        }
        setIsFetching((prev) => false) 
    }

    const getMelds = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/game/${roomData.gameId}/meld`)

            const data = await response.json()

            setMelds(data.groupedMelds)
        } catch (error) {
            console.log(error)
        }
    }

    const updateCards = (selectedCard: number) => {
        setCards((prev) => {
            let tempCards = prev.filter((item) => item.id !== selectedCard)

            return tempCards
        })
        setSelectedCards([])
    }

    console.log(roomData.gameStatus)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`game:${key}:turn`))
        
            const turnHandler = (data: {cardToDraw: number, currentTurn: string, gameStatus?: string, 
                gameId?: string, discartedCard?: number, players?: string[]}) => {
                
                console.log("Called")
                if(data.gameStatus) {


                    if(data.gameStatus === "INTERRUPTED" || data.gameStatus === "FINISHED") {
                        setRoomData(prev => ({
                            owner: prev.owner,
                            gameId: prev.gameId,
                            currentTurn: null,
                            gameStatus: data.gameStatus!
                        }))
                        setMelds({})
                        setCards([])
                        
                    } else {
                        setRoomData(prev => ({
                            ...prev,
                            gameStatus: data.gameStatus!
                        }))
                    }
                }

                if (data.players) {
                    setPlayers(data.players);
                }

                if(data.gameId) {
                    setRoomData(prev => ({
                        ...prev,
                        gameId: data.gameId!
                    }))
                    setHasDrew(true)
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
        pusherClient.subscribe(toPusherKey(`game:${key}:meld`))
        
            const meldHandler = (data: {newMeld: Meld,updatedMeld: Meld , playerName: string, selectedCard?: number}) => {
                
                console.log("Called", data)

                if(data.newMeld) {
                    setMelds((prevMelds) => ({
                        ...prevMelds,
                        [data.playerName]: [...(prevMelds[data.playerName] || []), data.newMeld],
                      }));
                }
                if (data.updatedMeld) {
                    setMelds((prevMelds) => {
                        let tempMelds = (prevMelds[data.playerName] || []).filter((item) => item.id !== data.updatedMeld.id);
            
                        return {
                            ...prevMelds,
                            [data.playerName]: [...tempMelds, data.updatedMeld],
                        };
                    });
            
                    console.log("RoomData CurrentTurn", roomData.currentTurn)
                    if(roomData.currentTurn === data.updatedMeld.player) {
                        console.log("Testt")
                    }
                }
            
            }
    
        pusherClient.bind(`game-meld`, meldHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`game:${key}:meld`))
            pusherClient.unbind('game-meld', meldHandler)
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        getRoomInfo()
    }, [])

    useEffect(() => {
        roomData.gameId && getMelds()
        setPlayers(prev => prev.filter((item) => item !== session.data?.user?.name))
    }, [roomData.gameId])

    useEffect(() => {
        if(roomData.currentTurn === session.data?.user?.name) {

            setHasDrew(false)
        }
    }, [roomData.currentTurn])

    if(isLoading || session.status === "loading") {
        return <div className="w-screen h-screen flex items-center justify-center">
            <CardBack className="animate-pulse xl:w-32" />
        </div>
    }

    if(roomData.gameStatus === 'FINISHED') {
        return <div className="flex-1 flex justify-center items-center">
            <TableOptions>
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                <h1 className="font-bold text-5xl">Game Finished</h1>
                {session.data?.user?.name === roomData?.owner ? <h1 className="text-3xl font-semibold cursor-pointer z-40"
                        onClick={() => startGame()}>
                            Start a new game
                        </h1> : <h1 className="text-3xl font-semibold">Waiting for room owner</h1>}
                </div>
            </TableOptions>
        </div>
    }

    if(roomData.gameStatus === 'INTERRUPTED') {
        return <div className="flex-1 flex gap-2">
        <div className="flex-1 flex justify-center items-center">
            <TableOptions>
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                <h1 className="font-bold text-5xl">Game was interrupted!</h1>
                {session.data?.user?.name === roomData?.owner ? <h1 className="text-3xl font-semibold cursor-pointer z-40"
                        onClick={() => startGame()}>
                            Start a new game
                        </h1> : <h1 className="text-3xl font-semibold">Waiting for room owner</h1>}
                </div>
            </TableOptions>
        </div>
        <GameMenu currentTurn={roomData.currentTurn} owner={roomData.owner} gameId={roomData.gameId} gameStatus={roomData.gameStatus}/>
        </div> 

    }

    return (
        <div className="flex-1 flex gap-2">
            {isFetching ? <div className="absolute w-12 h-12 top-6 left-2 animate-bounce">
                <div className="relative w-full h-full">
                    <Image fill alt="Cards icon" src='/cards.png'/>
                </div>
            </div> : null}
            <div className="flex-1 flex items-center flex-col pt-6 relative justify-evenly">
                <div className="flex-1 w-full flex justify-center items-center relative">
                    {roomData?.gameStatus === 'IN_PROGRESS' ? <div className="w-9/12  max-w-[850px] max-h-[600px] relative">

                        {players[1] ? <PlayerBubble playerName={players[1]} className={`${roomData.currentTurn === players[1] && 'border-red-400 border-2 shadow-red-glow'} -left-14 sm:-left-20 md:-left-24 lg:-left-28 top-1/2 -translate-y-1/2`}/> : null}
                        
                        
                        <PlayerBubble playerName={players[0]} className={`${roomData.currentTurn === players[0] && 'border-red-400 border-2 shadow-red-glow'} -top-12 md:-top-10 lg:-top-6 left-1/2 -translate-x-1/2`}/>
                        
                        {players[2] ? <PlayerBubble playerName={players[2]} className={`${roomData.currentTurn === players[2] && 'border-red-400 border-2 shadow-red-glow'} -right-14 sm:-right-20 md:-right-24 lg:-right-28 top-1/2 -translate-y-1/2`}/> : null}

                        <TableOptions>
                        {melds[players[0]] && <MeldArea isFetching={isFetching} getNewCards={updateCards} melds={melds[players[0]]} gameId={roomData.gameId} selectedCards={selectedCards}
                        className="w-2/4 h-[30%] absolute top-0 left-1/2 -translate-x-1/2 rotate-160"/>}
                        {players[1] && melds[players[1]] ? <MeldArea isFetching={isFetching} getNewCards={updateCards} gameId={roomData.gameId} melds={melds[players[1]]} selectedCards={selectedCards}
                        className="w-2/4 h-[30%] rotate-90 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[27.5%]" /> : null}
                    
                    {roomData.gameStatus != "IN_PROGRESS" && roomData.owner === session.data?.user?.name ? <button className="w-32 h-12 rounded-lg bg-peach cursor-pointer z-40" >
                        Start Game
                    </button> : <>
                    <div className={cn("w-14 sm:w-16 md:w-24 lg:w-28 h-24 sm:h-32 md:h-40 lg:h-44 shadow border-2 border-gray-700 rounded-xl cursor-pointer relative", {
                        "border-red-500 shadow-red-glow": hasDrew && cards.length && roomData.currentTurn === session.data?.user?.name
                    })} onClick={() => discardCard()}>
                        {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
                    </div>
                    <div onClick={() => drawCard()}>
                        <CardBack className={roomData.currentTurn === session.data?.user?.name && !hasDrew && cards.length !== 15 && cards.length !== 0 
                            ? "border-red-500 shadow-red-glow" : ""}/>
                    </div>
                    </>}
            
                    {roomData.gameStatus === "IN_PROGRESS"  && cards.length === 0 && <div className="absolute bottom-2" 
                    onClick={() => getMyCards()}>
                        {!isFetching ? <CardBundle /> : null}
                    </div>}
                    {cards.length !== 0 && melds[session.data?.user?.name!] && <MeldArea isFetching={isFetching} getNewCards={updateCards} gameId={roomData.gameId} selectedCards={selectedCards}
                    melds={melds[session.data?.user?.name!]} className="w-2/4 h-[30%] absolute bottom-0 left-1/2 -translate-x-1/2"/>}
                </TableOptions>
                    </div> : <TableOptions>
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
                    {isFetching && cards.length === 0 ? <LoadingHand /> : null}
                <div className="w-full h-12 bg-[#486581] mt-auto flex items-center justify-center gap-5">
                    <AlertDialog>
                        <AlertDialogTrigger className="text-paleblue font-medium text-lg cursor-pointer">Leave</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Leaving the table while the game is in progress will end the game for all players, 
                                and you may be penalized if this happens repeatedly
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => leaveTable()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => swapCards()}>Swap</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => drawCard()}>Draw</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => discardCard()}>Discard</p>
                    <p className="text-paleblue font-medium text-lg cursor-pointer" onClick={() => meldCards()}>Meld</p>
                </div>
            </div>
            <GameMenu currentTurn={roomData.currentTurn} owner={roomData.owner} gameId={roomData.gameId} gameStatus={roomData.gameStatus}/>
        </div>
    )
}

export default page