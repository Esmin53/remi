import Image from "next/image"
import React, { useState } from "react"


const HowToPlay = () => {
    const [isOpen, setIsOpen] = useState<boolean >(false)

    return (
        <div className="">
            {isOpen ? <div className="fixed w-screen h-screen top-0 left-0 z-[60]"> 
                <Image fill alt="" src={"/table/red.jpg"} />
            </div> : null}
            {isOpen ? <span className="text-4xl font-semibold z-[70] fixed top-4 right-6 lg:right-12 cursor-pointer" onClick={() => setIsOpen(false)}>X</span> : 
            <span className="text-4xl font-semibold cursor-pointer" onClick={() => setIsOpen(true)}>?</span>}
            {isOpen ? <div className="absolute w-full min-h-screen  left-0 top-0 z-[60] bg-black/75 px-6 xl:px-16 py-4 md:py-6">
                <div className="flex flex-col w-full max-w-96 gap-2">
                <h1 className="text-3xl md:text-4xl font-semibold">How to play</h1>
                <div className="h-0.5 w-5/6  flex bg-lightblue rounded-lg my-2" />
                </div>
                <div className="w-full md:px-4 xl:px-12 py-6 xl:py-8 flex flex-col gap-6 lg:gap-8 justify-center items-center">
                    <div className="flex flex-col-reverse lg:flex-row w-full gap-4 xl:gap-6 items-center">
                        <div className="flex-1 p-3 sm:p-4 bg-gray-900/50 rounded-lg shadow-lg max-w-2xl lg:max-w-3xl ">
                            <h2 className="text-2xl font-bold">
                                Finding and joining rooms
                            </h2>
                            <div className="h-0.5 w-5/6  flex bg-lightblue rounded-lg my-2" />
                            <p className="font-medium text-start w-full px-2 text-sm lg:text-base">
                                In order to play online you have to find and join a room with other players.
                                You can find available rooms by clickng find room in navigation, there you can find available rooms that are not full or there isn&apos;t a game in progress.
                                If you want to join a speciffic room you must have the room key.
                            </p>
                        </div>
                        <div className="flex-1 w-full max-w-2xl relative aspect-video">
                            <Image fill alt="How to join room" src="/instructions/joining.jpg" quality={100} sizes="(max-width: 768px) 50vw, 100vw" />
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row w-full gap-4 xl:gap-6 items-center">
                        <div className="flex-1 w-full max-w-2xl relative aspect-video">
                            <Image fill alt="How to join room" src="/instructions/game01.jpg" quality={100} sizes="(max-width: 768px) 50vw, 100vw" />
                        </div>
                        <div className="flex-1 max-w-2xl lg:max-w-3xl p-4 bg-gray-900/50 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold">
                                How to play
                            </h2>
                            <div className="h-0.5 w-5/6  flex bg-lightblue rounded-lg my-2" />
                            <p className="font-medium text-start w-full px-2 text-sm lg:text-base">
                                Once the room owner starts the game your cards will be dealt, you can pick them up by clicking on the bundle of 
                                cards infront of you. <br />
                                In the sidebar you can see information about the room, current game and players. Cards icon and red glow around players bubble indicate that its that players move.
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col-reverse lg:flex-row  w-full gap-2 lg:gap-4 xl:gap-6 items-center">
                        <div className="flex-1 max-w-2xl lg:max-w-3xl p-3 md:p-4 bg-gray-900/50 rounded-lg shadow-lg flex-shrink-0">
                            <h2 className="text-2xl font-bold">
                                How to play
                            </h2>
                            <div className="h-0.5 w-5/6  flex bg-lightblue rounded-lg my-2" />
                            <p className="font-medium text-start w-full px-2 text-sm xl:text-base ">
                                Once the room owner starts the game your cards will be dealt, you can pick them up by clicking on the bundle of 
                                cards infront of you. Use the slider in bottom right corner to move them vertically. You can also sort them in ascending order by clicking on the 
                                <span className="font semibold">{" >K"}</span> button.<br />
                                In the sidebar you can see information about the room, current game and players. Cards icon and red glow around players bubble indicate that its that players move.
                                On the beggining of your turn you can draw a card by clicking the deck which will be glowing red or the draw button in left corner. You can also draw the last discarted card by clicking on it.
                            </p>
                        </div>
                        <div className="flex-1 w-full max-w-2xl relative aspect-video">
                            <Image fill alt="How to join room" src="/instructions/game02.jpg"  quality={100} sizes="(max-width: 768px) 50vw, 100vw"/>
                        </div>
                    </div>
                    <div className="w-full flex flex-col py-4 md:py-10"> 
                        <h2 className="text-2xl font-semibold md:font-bold">
                            Melding and adding to melds
                        </h2>
                        <p>If you have the right cards, select atleast 3 of them and click on the meld button. 1 or 2 melds will be displayed on the table per player, click on the 
                            meld to view the rest. To add to meld select one card then click on the meld you want to add. You can&apos;t add a card to meld if its the last card in your hand.
                        </p>
                    </div>
                    <div className="w-full flex flex-col pb-4 md:pb-10"> 
                        <h2 className="text-2xl font-semibold md:font-bold">
                            Discarding and finishing game
                        </h2>
                        <p>Select one card and click on the discarded cards deck which will be glowing red. Once you discard your turn will end. If you discard the last
                            card from your hand you win.
                        </p>
                    </div>
                    </div>
            </div> : null}
        </div>
    )
}

export default React.memo(HowToPlay) 