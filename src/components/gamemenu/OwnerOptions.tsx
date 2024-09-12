import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"



interface OwnerOptionsProps {
    gameId: string | null,
    gameStatus: string | null
}

const OwnerOptions = ({gameId, gameStatus}: OwnerOptionsProps) => {

    const { toast } = useToast()
    const key = usePathname().split("/")[2]

    const endGame = async () => {
        if(gameStatus !== "IN_PROGRESS") return
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/owner/game?gameId=${gameId}&gameStatus=${gameStatus}`, {
                method: "PUT"
            });

            const data = await response.json()

        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
        }
    }

    const deleteRoom = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/room/${key}/owner`, {
                method: "DELETE"
            });

            if(response.ok) {
                toast({
                    title: "Room deleted successfully",
                    description: "Room was deleted successfully.",
                })
            }

            const data = await response.json()

            console.log(data)
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "An unexpected error has occured, please check your internet connection or refresh the browser.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="w-full flex flex-col gap-1">
            <h2 className="text-xl font-medium">Manage room</h2>
            <div className="h-0.5 w-3/5 bg-lightblue rounded-lg" />
            <p className="ml-2 cursor-pointer font-medium">Ping room</p>
            <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <p className="ml-2 cursor-pointer font-medium">Delete room</p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. Are you absolutely sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteRoom()}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <p className="ml-2 cursor-pointer font-medium" >End game</p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. Are you absolutely sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => endGame()}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

        </div>
    )
}

export default OwnerOptions