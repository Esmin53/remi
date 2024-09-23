import AuthModal from "@/components/AuthModal"
import authOptions from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await getServerSession(authOptions)

    if(session?.user) {
        redirect('/')
    }

    return (
        <div className="w-full h-full flex-1 flex items-center justify-center gap-12 md:gap-16 lg:gap-24 p-2 flex-col sm:flex-row">
            <div className="max-w-2xl w-full sm:w-fit sm:-mt-36 flex flex-col gap-4 justify-start">
                <h1 className="text-3xl xs:text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Wellcome to Remi Online</h1>
                <p className="max-w-lg">Create a room and invite up to 4 friends, or join a random room with starngers from all over the world.</p>
            </div>
            <AuthModal />
        </div>
    )
}

export default Page