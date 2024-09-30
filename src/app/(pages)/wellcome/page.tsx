import AuthModal from "@/components/AuthModal"
import authOptions from "@/lib/auth"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await getServerSession(authOptions)

    if(session?.user) {
        redirect('/')
    }

    return (
        <div className="w-full h-full flex-1 flex items-center justify-center gap-8 md:gap-16 lg:gap-24 p-6 flex-col sm:flex-row relative"
        style={{background: "url(/background/bg06.jpg)"}}>
            
            <div className="max-w-2xl w-full sm:w-fit flex flex-col sm:-mt-36 gap-8 sm:gap-16 justify-start">
                <Image alt="Logo 2" src="/logo01.png" width={470} height={354} className="w-80 mx-auto"/>
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl xs:text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center sm:text-start">Wellcome to Rummy Online</h1>
                    <p className="max-w-lg">Create a room and invite up to 4 friends, or join a random room with starngers from all over the world.</p>
                </div>
            </div>
            <AuthModal />
        </div>
    )
}

export default Page