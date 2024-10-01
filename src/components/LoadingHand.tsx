import CardBack from "./CardBack"

const LoadingHand = ({deck}: {deck: string}) => {
    return (
        <div className="w-full flex items-center justify-center absolute -bottom-7 sm:-bottom-16 md:-bottom-32 lg:-bottom-36">
        <div className="w-fit h-fit flex justify-center -mt-12 flex-shrink-0 ml-7 sm:ml-10 md:ml-16 lg:ml-20 animate-pulse">
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24" deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
            <CardBack className=" -ml-8 sm:-ml-14 md:-ml-20 lg:-ml-24"  deck={deck} />
        </div>
    </div>
    )
}

export default LoadingHand;