import type { JWT } from 'next-auth/jwt'

type UserId = string
type Username = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
  }
}

declare module "next-auth" {

    interface Session {
      user: {
        id: number | null | undefined
      }
    }
  }

export type SessionUser = {
  user:  {
    id: number | null | undefined
} | undefined
}

