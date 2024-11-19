import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.isSubscribed = token.isSubscribed as boolean
      }
      return session
    },
    async jwt({ token, user }) {
      if (!user) {
        token.isSubscribed = false // Will be updated after checking subscription
        return token
      }

      // Check subscription status
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        include: { subscription: true },
      })

      if (dbUser?.subscription) {
        token.isSubscribed = dbUser.subscription.status === 'active'
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.image,
      }
    },
  },
  events: {
    async signIn({ user }) {
      // Create or update user achievements/stats
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      })
    },
  },
}