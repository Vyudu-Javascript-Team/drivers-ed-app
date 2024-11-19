import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      isSubscribed: boolean
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    isSubscribed?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    picture?: string
    isSubscribed?: boolean
  }
}