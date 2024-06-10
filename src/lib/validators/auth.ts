import { z } from "zod";


export const AuthCredentialsValidator = z.object({
    username: z.string().min(3, "Username must contain atleast 3 characters").max(16, "Username cannot be longer than 16 characters"),
    password: z.string().min(5, "Password must contain atleast 5 characters").max(16, "Username cannot be longer than 16 characters")
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator> 