import CardBack from "./CardBack"

const LoadingHand = () => {
    return (
        <div className="w-full flex items-center justify-center absolute -bottom-20 sm:-bottom-28 md:-bottom-36">
        <div className="w-fit h-fit flex justify-center -mt-12 flex-shrink-0 ml-7 sm:ml-10 md:ml-16 lg:ml-20 animate-pulse">
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20"/>
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
            <CardBack className=" -ml-7 sm:-ml-10 md:-ml-16 lg:-ml-20" />
        </div>
    </div>
    )
}

export default LoadingHand;