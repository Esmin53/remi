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
import { useToast } from "@/hooks/use-toast"
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
    const { toast } = useToast()

    const [selectedCards, setSelectedCards] = useState<Card[]>([])
    const [cardToDraw, setCardToDraw] = useState<Card | null>(null)
    const [lastDiscartedCard, setLastDiscartedCard] = useState<Card | null>(null)
    const [cards, setCards] = useState<Card[] >([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasDrew, setHasDrew] = useState(false)
    const [players, setPlayers] = useState<{
        username: string,
        avatar: string | null
    }[] >([])
    const [roomData, setRoomData] = useState<{
        owner: string
        background: string
        gameId: string | null
        gameStatus: string | null
        currentTurn: string | null
        winner: string | null
        message: string | null
    }>({
        owner: "",
        background: "",
        gameId: null,
        gameStatus: null ,
        currentTurn: null,
        winner: null,
        message: null
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
                background: data.background,
                gameStatus: data.gameStatus || null,
                currentTurn: data.currentTurn || null,
                winner: data.winner || null,
                message: data.message || null
            })

            setPlayers(data.players)

            if(data.gameStatus === "IN_PROGRESS") {
                let card = CARDS.find(item => item.id === data.deck)
                setCardToDraw(card!)
                setHasDrew(data.hasDrew)
            }

            setIsLoading(false)
        } catch (error) {
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

            setIsFetching((prev) => false)
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
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

            await setCards(getCards(data.cards))

            setIsFetching((prev) => false)
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
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
        
        if(hasDrew) return
        
        if(cards.length >= 15) return
        
        if(isFetching) return
        setIsFetching(true)
        
        try {
    
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
    
            if(cardToDraw)
            setCards([...cards, newCard])
            setCardToDraw(null)
    
            setIsFetching((prev) => false)
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
            setIsFetching(prev => false)
        }
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
    
            if(!response.ok) throw new Error()
            const data = await response.json()

            setIsFetching((prev) => false)

        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
            setIsFetching(prev => false)
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

        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
            setIsFetching(prev => false)
        }
    }

    const swapCards = () => {
        if (selectedCards.length > 2 || selectedCards.length < 2) {
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
        if(selectedCards.length === cards.length) return
        setIsFetching(true)
        let cardIds = selectedCards.sort((a, b) => Number(a.value) - Number(b.value)).map((item) => item.id);
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
                    toast({
                        title: "Something went wrong!",
                        description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                        variant: "destructive"
                    })
                    setIsFetching(prev => false)
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
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
            setIsFetching(prev => false)
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


    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`game:${key}:turn`))
        
            const turnHandler = (data: {cardToDraw: number, currentTurn: string, gameStatus?: string, 
                gameId?: string, discartedCard?: number, winner?: string, message?: string, players?: {
                    username: string
                    avatar: string | null
                }[]}) => {
                
                console.log("Called")
                if(data.gameStatus) {


                    if(data.gameStatus === "INTERRUPTED" || data.gameStatus === "FINISHED") {
                        setRoomData(prev => ({
                            owner: prev.owner,
                            gameId: prev.gameId,
                            background: prev.background,
                            currentTurn: null,
                            gameStatus: data.gameStatus!,
                            winner: data.winner || null,
                            message: data.message || null
                        }))
                        setMelds({})
                        setCards([])
                        setLastDiscartedCard(prev => null)
                        
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
                        winner: null,
                        message: null,
                        currentTurn: data.currentTurn,
                        gameId: data.gameId!
                    }))
                    setHasDrew(prev => true)
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
        setPlayers(prev => prev.filter((item) => item.username !== session.data?.user?.name))
    }, [roomData.gameId])

    useEffect(() => {
        if(roomData.currentTurn === session.data?.user?.name && lastDiscartedCard !== null) {
            setHasDrew(false)
        }
    }, [roomData.currentTurn])

    if(isLoading || session.status === "loading") {
        return <div className="w-screen h-screen flex items-center justify-center" style={{
            backgroundImage: `url(/background/bg01.jpg)`}}>
            <CardBack className="animate-pulse xl:w-32" />
        </div>
    }

    if(roomData.gameStatus !== 'IN_PROGRESS') {
        return <div className="flex-1 flex gap-2 bg-cover" style={{
            backgroundImage: `url(/background/${roomData.background})`}}>
                <div className="flex-1 flex items-center justify-center">
       <div className="w-8/12 sm:w-9/12 max-w-[850px] max-h-[600px] relative">
            <TableOptions>
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-center">
                {roomData.winner && (
                    <p className="text-sm font-medium sm:text-xl md:text-3xl lg:text-4xl md:font-semibold bg-gradient-to-r from-pink-400 via-purple-300 to-blue-500 bg-clip-text text-transparent">
                    {roomData.winner === session.data?.user?.name
                        ? "You have won the game!"
                        : `${roomData.winner} has won the game.`}
                    </p>
                )}
                
                {roomData.gameStatus === "FINISHED" && (
                    <h1 className="font-semibold sm:font-bold sm:text-xl md:text-3xl lg:text-4xl text-green-500 bg-gray-900 bg-opacity-70 p-1 sm:p-2 md:p-3 lg:p-4 rounded-lg shadow-lg">
                    🎉 Game Finished! 🎉
                    </h1>
                )}

                {roomData.message && (
                    <p className="text-sm font-medium sm:text-xl md:text-3xl sm:font-semibold text-white ">
                        {roomData.message}
                    </p>
                )}

                {roomData.gameStatus === "INTERRUPTED" && (
                    <h1 className="font-semibold sm:font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-red-500 bg-gray-900 bg-opacity-70 p-1 sm:p-2 md:p-3 lg:p-4 rounded-lg shadow-lg">
                    ⚠️ Game Was Interrupted ⚠️
                    </h1>
                )}

                {session.data?.user?.name === roomData?.owner ? (
                    <h1
                    className="text-md font-medium sm:text-xl md:text-2xl lg:text-3xl sm:font-semibold text-white cursor-pointer z-40 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300 px-2 py-1 sm:p-2 lg:p-3 rounded-lg shadow-lg hover:-translate-y-1 duration-300"
                    onClick={() => startGame()}
                    >
                    Start a New Game
                    </h1>
                ) : (
                    <h1 className="text-sm sm:text-xl font-semibold text-white animate-pulse">
                    ⏳ Waiting for the room owner to start the game...
                    </h1>
                )}
                </div>

            </TableOptions>
        </div>
                </div>
 
        <GameMenu currentTurn={roomData.currentTurn} owner={roomData.owner} gameId={roomData.gameId} gameStatus={roomData.gameStatus}/>
        </div> 
    }

    return (
        <div className="flex-1 flex overflow-hidden bg-cover relative" style={{
            backgroundImage: `url(/background/${roomData.background})`}}>
            {isFetching ? <div className="absolute w-7 h-7 sm:w-12 sm:h-12 top-10 md:top-6 left-2 animate-bounce">
                <div className="relative w-full h-full">
                    <Image fill alt="Cards icon" src='/cards.png'/>
                </div>
            </div> : null}
            <div className="flex-1 flex flex-col items-start sm:items-center justify-center overflow-hidden">
                <div className="w-full flex flex-col sm:justify-center justify-start items-center">
                    <div className="w-[61.5%] sm:w-9/12 max-w-[850px] max-h-[600px] relative pt-4">

                        {players[1] ? <PlayerBubble avatar={players[1].avatar} playerName={players[1].username} className={`${roomData.currentTurn === players[1].username && 'border-red-400 border-2 shadow-red-glow'} -left-10 sm:-left-20 md:-left-24 lg:-left-28 top-1/2 -translate-y-1/2`}/> : null}
                        
                        {players[0] ? <PlayerBubble avatar={players[0].avatar} playerName={players[0].username} className={`${roomData.currentTurn === players[0].username && 'border-red-400 border-2 shadow-red-glow'} top-1 left-1/2 -translate-x-1/2`}/> : null}
                        
                        {players[2] ? <PlayerBubble avatar={players[2].avatar} playerName={players[2].username} className={`${roomData.currentTurn === players[2].username && 'border-red-400 border-2 shadow-red-glow'} -right-10 sm:-right-20 md:-right-24 lg:-right-28 top-1/2 -translate-y-1/2`}/> : null}

                        <TableOptions>
                        {players[0] && melds[players[0].username] && <MeldArea isFetching={isFetching} getNewCards={updateCards} melds={melds[players[0].username]} gameId={roomData.gameId} selectedCards={selectedCards}
                        className="w-2/4 h-[30%] absolute top-0 left-1/2 -translate-x-1/2 rotate-160"/>}
                        {players[1] && melds[players[1].username] ? <MeldArea isFetching={isFetching} getNewCards={updateCards} gameId={roomData.gameId} melds={melds[players[1].username]} selectedCards={selectedCards}
                        className="w-2/4 h-[30%] rotate-90 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[27.5%]" /> : null}
                        {players[2] && melds[players[2].username] ? <MeldArea isFetching={isFetching} getNewCards={updateCards} gameId={roomData.gameId} melds={melds[players[2].username]} selectedCards={selectedCards}
                        className="w-2/4 h-[30%] rotate-90 absolute right-0 top-1/2 -translate-y-1/2 translate-x-[27.5%]" /> : null}
                    
                    
                    <div className={cn("w-[3.1rem] h-[4.4rem] sm:w-[4.6rem] md:w-[7.04rem] lg:w-32 sm:h-32 md:h-40 lg:h-44 shadow-sm sm:shadow border sm:border-2 border-gray-700 rounded-sm sm:rounded-xl cursor-pointer relative translate-x-1.5 sm:translate-x-0", {
                        "border-red-500 shadow-red-glow": hasDrew && cards.length && roomData.currentTurn === session.data?.user?.name
                    })} onClick={() => discardCard()}>
                        {lastDiscartedCard?.image ? <Image alt="Card" fill src={lastDiscartedCard.image} /> : null}
                    </div>
                    <div onClick={() => drawCard()} className="-translate-x-1.5 sm:-translate-x-0">
                        <CardBack className={roomData.currentTurn === session.data?.user?.name && !hasDrew && cards.length !== 15 && cards.length !== 0 
                            ? "border-red-500 shadow-red-glow" : ""}/>
                    </div>
                    
            
                    {roomData.gameStatus === "IN_PROGRESS"  && cards.length === 0 && <div className="absolute bottom-2" 
                    onClick={() => getMyCards()}>
                        {!isFetching ? <CardBundle /> : null}
                    </div>}
                    {cards.length !== 0 && melds[session.data?.user?.name!] && <MeldArea isFetching={isFetching} getNewCards={updateCards} gameId={roomData.gameId} selectedCards={selectedCards}
                    melds={melds[session.data?.user?.name!]} className="w-2/4 h-[30%] absolute bottom-0 left-1/2 -translate-x-1/2"/>}
                </TableOptions>

                    </div>
                </div>
                {cards?.length ? <MyHand 
                    selectedCards={selectedCards}
                    cards={cards} 
                    selectCard={selectCard}/> : null}
                    {!roomData.winner && isFetching && cards.length === 0 ? <LoadingHand /> : null}


                <div className="w-fit p-1.5 sm:py-2 md:px-3 sm:h-10 bg-[#486581] flex items-center justify-center gap-3 opacity-75 hover:opacity-100 hover:z-50
                sm:gap-5 fixed left-0 md:bottom-0 top-0 md:mt-auto rounded-br-lg md:rounded-br-none md:rounded-tr-lg sm:rounded-none shadow-sm sm:shadow">
                    <AlertDialog>
                        <AlertDialogTrigger className="text-paleblue sm:font-medium text-xs sm:text-lg cursor-pointer">Leave</AlertDialogTrigger>
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
                    <p className="text-paleblue sm:font-medium text-xs sm:text-lg cursor-pointer" onClick={() => swapCards()}>Swap</p>
                    <p className="text-paleblue sm:font-medium text-xs sm:text-lg cursor-pointer" onClick={() => drawCard()}>Draw</p>
                    <p className="text-paleblue sm:font-medium text-xs sm:text-lg cursor-pointer" onClick={() => discardCard()}>Discard</p>
                    <p className="text-paleblue sm:font-medium text-xs sm:text-lg cursor-pointer" onClick={() => meldCards()}>Meld</p>
                </div>
            </div>
            <GameMenu currentTurn={roomData.currentTurn} owner={roomData.owner} gameId={roomData.gameId} gameStatus={roomData.gameStatus}/>
        </div>
    )
}

export default page