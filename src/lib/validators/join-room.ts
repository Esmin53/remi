import { z } from "zod";


export const JoinRoomValidator = z.object({
    key: z.string().min(3, "Room key must contain atleast 3 characters").max(16, "Room key cannot be longer than 16 characters"),
    password: z.string().optional()
})

export type TJoinRoomValidator = z.infer<typeof JoinRoomValidator> 