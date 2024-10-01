import { z } from "zod";


export const RoomCredentialsValidator = z.object({
    key: z.string().min(3, "Room key must contain atleast 3 characters").max(16, "Room key cannot be longer than 16 characters"),
    allowRandom: z.boolean().default(false),
    background: z.string().default("bg01.jpg"),
    table: z.string().default("red.jpg"),
    deck: z.string().default("white")
})

export type TRoomCredentialsValidator = z.infer<typeof RoomCredentialsValidator> 