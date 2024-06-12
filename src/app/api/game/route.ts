import { shuffle } from "@/lib/utils"
import { NextResponse } from "next/server"

export const GET = (req: Request, res: Response) => {
    try {
        let startingDeck = shuffle()

        let playerOne = startingDeck.splice(0, 14)

        return new NextResponse(JSON.stringify({startingDeck, playerOne}), { status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}