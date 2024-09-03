import { Heart } from "lucide-react";


const Menu = () => {
    
    return (
          <div className="flex">
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            -rotate-12 z-10 hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-8 hover:-translate-y-12">
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Sign
                <br />Out</p>
            </div>
            <div className="w-52 h-64  bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer -ml-12 rounded-lg -translate-y-9 z-20
            hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-8 hover:-translate-y-12">
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Create <br /> new 
                <br />Room</p>
            </div>
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer -ml-12  rotate-12 -translate-y-5 z-30
            hover:shadow-brighter-red-glow duration-100 flex items-center justify-center hover:-translate-x-12 hover:-translate-y-12 hover:rotate-[5deg]">
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Enter <br /> room 
                <br />key</p>
            </div>
            <div className="w-52 h-64 rounded-xl bg-[#4d4d4d] border-2 border-red-500 shadow-red-glow relative overflow-hidden cursor-pointer 
            hover:shadow-brighter-red-glow duration-100 -ml-16 rotate-[20deg] z-40 translate-y-6 flex justify-center items-center hover:-translate-x-5 
            hover:-translate-y-4 hover:rotate-[8deg]">
                <Heart className="absolute left-2 top-2 text-red-500 w-8 h-7"/>
                <Heart className="absolute right-2 bottom-2 text-red-500 w-8 h-7"/>
                <p className="text-xl font-semibold text-red-500 text-center">Find a 
                    <br />room</p>
            </div>
          </div>

    )
}

export default Menu;