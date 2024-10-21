import { AVATARS, BACKGROUNDS, DECKS, TABLES } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const Page = () => {

    return (
        <main className="flex-1 flex p-2 sm:p-4 relative flex-col gap-6 md:gap-8" style={{backgroundImage: `url(/table/dark_blue.jpg)`}}>

                <div className="flex flex-col gap-4 pb-10">
                <div className="w-full flex items-center">
                    <h1  className="text-5xl sm:text-6xl font-bold">Assets</h1>
                    <Link href="/" className="ml-auto">
                    <HomeIcon className="w-8 sm:w-10 h-8 sm:h-10" />
                    </Link>
                </div>
                    <p className="font-medium text-xl ">All of the assets used and listed bellow belong to their respected owners.</p>
                </div>

            <div className="flex flex-col">
                <h1 className="text-3xl font-semibold md:font-bold">Tables</h1>
                <div className="h-0.5 w-5/6 md:w-4/6 flex bg-lightblue rounded-lg my-2" />
                <p className="sm:text-lg md:text-xl font-medium pb-4">All assets used for tables from <span className="font-bold">
                www.freepik.com</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-2 sm:gap-3 md:gap-4">
                    {TABLES?.map((item) => (
                            <div key={item} className="relative flex-1 border-2 shadow border-gray-900 rounded-md overflow-hidden aspect-video">
                                <Image src={`/table/${item}`} fill alt="Table" loading="lazy" className="hover:scale-[1.05] duration-150 ease-in-out"/>
                            </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
            <h1 className="text-3xl font-semibold md:font-bold">Backgrounds</h1>
                <div className="h-0.5 w-5/6 md:w-4/6 flex bg-lightblue rounded-lg my-2" />
                <p className="sm:text-lg md:text-xl font-medium pb-4">All assets used for backgrounds from <span className="font-bold">
                www.freepik.com</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-2 sm:gap-3 md:gap-4">
                    {BACKGROUNDS?.map((item) => <div key={item} className="relative w-full h-full border-2 shadow border-gray-900 rounded-md overflow-hidden aspect-video">
                        <Image src={`/background/${item}`} fill alt="Background" loading="lazy"/>
                    </div>)}
                </div>
            </div>
            <div className="flex flex-col">
            <h1 className="text-3xl font-semibold md:font-bold">Decks</h1>
                <div className="h-0.5 w-5/6 md:w-4/6 flex bg-lightblue rounded-lg my-2" />
                <p className="sm:text-lg md:text-xl font-medium pb-4">All assets used for card decks from <a target="_blank" 
                href="https://mreliptik.itch.io/playing-cards-packs-52-cards" className="font-bold text-blue-500">
                here.</a></p>
                <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {DECKS?.map((item) => <div key={item} className="relative w-28 md:w-36 h-36 md:h-44 border-2 shadow border-gray-900 rounded-xl overflow-hidden">
                        <Image src={`/cards/${item}/Clovers_A.png`} fill alt="Background" loading="lazy"/>
                    </div>)}
                </div>
            </div>
            <div className="flex flex-col">
            <h1 className="text-3xl font-semibold md:font-bold">Avatars</h1>
                <div className="h-0.5 w-5/6 md:w-4/6 flex bg-lightblue rounded-lg my-2" />
                <p className="sm:text-lg md:text-xl font-medium pb-4">All assets used for user avatars from <span className="font-bold">
                www.freepik.com</span></p>
                <div className="grid grid-cols-3 md:flex flex-wrap max-w-96 md:max-w-max w-full gap-1 sm:gap-3 md:gap-4">
                    {AVATARS?.map((item) => <div key={item} className="relative w-full md:w-36 border-2 shadow border-gray-900 rounded-md overflow-hidden aspect-square">
                        <Image src={`/avatar/${item}`} fill alt="Background" loading="lazy"/>
                    </div>)}
                </div>
            </div>
            <div className="flex flex-col">
            <h1 className="text-3xl font-semibold md:font-bold">Icons</h1>
                <div className="h-0.5 w-5/6 md:w-4/6 flex bg-lightblue rounded-lg my-2" />
                <p className="sm:text-lg md:text-xl font-medium pb-4">All assets used for icons.</p>
                <div className="flex flex-wrap w-full gap-2 sm:gap-3 md:gap-4">
                    <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 relative ">
                            <Image fill alt="Github logo" src={"/icns/github.png"}/>
                        </div>
                    <a target="_blank" href="https://icons8.com/icon/62856/github">GitHub</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
                    </div>
                </div>
            </div>
            <Link href={`/`} className="text-blue-500 text-3xl sm:text-4xl font-semibold mx-auto" >Take me back</Link>
        </main>
    )
}

export default Page