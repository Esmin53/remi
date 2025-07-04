import { ChevronLeft, ChevronRight, LogOut, User2 } from "lucide-react";
import Players from "./Players";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { usePathname, useRouter } from "next/navigation";
import OwnerOptions from "./OwnerOptions";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRoomData } from "../RoomProvider";


interface GameMenuProps {
    owner: string,
    currentTurn: string | null,
    gameId: string | null,
    gameStatus: string | null
}

const GameMenu = ({ owner, currentTurn, gameId, gameStatus }: GameMenuProps) => {
    const [hideMenu, setHideMenu] = useState(false)

    const key = usePathname().split("/")[2]
    const session = useSession()
    const router = useRouter()
    const { toast } = useToast()

    const { table } = useRoomData();

    const leaveTable = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/players?gameId=${gameId}&gameStatus=${gameStatus}`, {
                method: "DELETE"
            });

            const data = await response.json()

            if(response.ok && response.status === 200) {
                router.push("/");
                router.refresh();
            }

        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
        }
    }


    return (
        <div className="relative max-h-screen">
            <div className="absolute top-1.5 sm:top-4 right-1.5 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 bg-lightblue/70 cursor-pointer z-30 flex items-center justify-center rounded-full">
                <ChevronLeft className="w-6 sm:w-8 h-6 sm:h-8" onClick={() => setHideMenu(false)}/>
            </div>
            <div className={cn("h-full z-40 w-screen max-w-80 lg:max-w-96 xl:w-96 absolute right-0 top-0 xl:relative bg-red-400 min-h-screen max-h-screen overflow-y-auto ml-auto border-l border-lightblue shadow-sm p-2 flex flex-col gap-4", {
           "hidden": hideMenu 
        })}>
            
            <div className="absolute top-4 left-4 w-9 sm:w-10 h-9 sm:h-10 bg-lightblue cursor-pointer z-30 flex items-center justify-center rounded-full">
                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" onClick={() => setHideMenu(true)}/>
            </div>
            <div className="w-full flex flex-col justify-center items-center z-10">
                <div className="z-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded sm:rounded-md bg-paleblue border-2 shadow-sm border-lightblue relative overflow-hidden">
                    {session.data?.user?.image ? <Image fill alt="User avatar" src={`/avatar/${session.data.user.image}`} className="object-cover z-30" /> : null}
                    <User2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lightblue w-28 h-28" />
                </div>
                <h2 className="sm:text-xl lg:text-2xl font-bold">{session.data?.user?.name}</h2>
            </div>
            <Players owner={owner} currentTurn={currentTurn} gameId={gameId} gameStatus={gameStatus}/>
            <div className="flex flex-col w-full z-10">
                <h1 className="text-lg sm:text-2xl font-medium -translate-y-0.5 z-10">
                    {gameStatus === "IN_PROGRESS" ? "Game is in progress." : null}
                    {gameStatus === "INTERRUPTED" ? "Last game was interrupted!" : null}
                </h1>
                <div className="h-0.5 w-3/5 bg-lightblue rounded-lg z-10" />
                <p className="font-medium translate-y-0.5 z-10">
                    {gameStatus === "IN_PROGRESS" ? `${currentTurn === session.data?.user?.name ? "Your" : `${currentTurn}'s`} turn.` : null}
                    {gameStatus === "INTERRUPTED" || gameStatus === "FINISHED" ? "Waiting for table owner to start a new game!" : null}
                </p>
            </div>
            {owner === session.data?.user?.name ? <OwnerOptions gameId={gameId} gameStatus={gameStatus}/> : null}
            <div className="absolute top-4 right-4 w-10 h-10  cursor-pointer z-30 flex items-center justify-center">
            <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <LogOut className="w-6 h-6 sm:w-7 sm:h-7" />
                        </AlertDialogTrigger>
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
            </div>
            <Image fill alt="" src={`/table/${table}`} className="object-cover -z-10"/>
        </div>
        </div>
    )
}

export default GameMenu;