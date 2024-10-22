import Image from "next/image";
import JoinRoom from "./JoinRoom";
import Table from "./Table";

const Rooms = () => {

    return (
        <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 lg:w-1/3 lg:min-w-96 max-w-xl h-fit flex flex-col justify-center  md:sticky md:top-32 lg:top-36">
                <h1 className="text-2xl lg:text-3xl font-semibold">Join your friends.</h1>
                <p className="text-base">Enter a room key and join a room.</p>
                <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
                <JoinRoom />
            </div>
        <div className="flex-1 bg-gray-900/20 shadow-sm rounded-lg border border-gray-900/25 p-2">
        <div>
            <h1 className="text-3xl font-semibold">Find a room.</h1>
            <p className="text-base">Join a room and start playing now.</p>
            <div className="h-0.5 w-4/5 flex bg-lightblue rounded-lg my-2" />
          </div>
        <div className="flex-1 gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className=" p-1 h-fit">
                    <div className="w-full aspect-video relative rounded-sm overflow-hidden flex items-center justify-center">
                        <Image fill alt="Table" src={`/background/bg02.jpg`} loading="lazy" sizes="(max-width: 634px) 100vw, 40vw" />
                        <Table  color="dark_blue.jpg" className="w-9/12">

                        </Table>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-lg font-medium p-2">Room 1</h2>
                        <p className="">Join</p>
                    </div>
                </div>
                <div className=" p-1 h-fit">
                    <div className="w-full aspect-video relative rounded-sm overflow-hidden flex items-center justify-center">
                        <Image fill alt="" src={`/background/bg03.jpg`} loading="lazy" sizes="(max-width: 634px) 100vw, 40vw"/>
                        <Table  color="green.jpg" className="w-9/12" />
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-lg font-medium p-2">Room 2</h2>
                        <p className="">Join</p>
                    </div>
                </div>
                <div className=" p-1 h-fit">
                    <div className="w-full aspect-video relative rounded-sm overflow-hidden flex items-center justify-center">
                        <Image fill alt="" src={`/background/bg04.jpg`} loading="lazy" sizes="(max-width: 634px) 100vw, 40vw"/>
                        <Table  color="purple.jpg" className="w-9/12" />
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-lg font-medium p-2">Room 2</h2>
                        <p className="">Join</p>
                    </div>
                </div>

            </div>
            
        </div>
        </div>
    )
}

export default Rooms;