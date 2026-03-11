import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcryptjs from "bcryptjs"
import { prisma } from "./db"
import { checkRateLimit, resetRateLimit } from "./rate-limit"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const email = credentials.email as string
                const rl = checkRateLimit(`login:${email}`)
                if (!rl.allowed) return null

                // Try Guide first
                const guide = await prisma.guide.findUnique({ where: { email } })
                if (guide?.password) {
                    const valid = await bcryptjs.compare(credentials.password as string, guide.password)
                    if (valid) {
                        resetRateLimit(`login:${email}`)
                        return { id: guide.id, email: guide.email, name: guide.name, image: guide.avatarUrl, role: "guide" }
                    }
                }

                // Fallback to AppUser
                const user = await prisma.appUser.findUnique({ where: { email } })
                if (user?.password) {
                    const valid = await bcryptjs.compare(credentials.password as string, user.password)
                    if (valid) {
                        resetRateLimit(`login:${email}`)
                        return { id: user.id, email: user.email, name: user.name, image: user.avatarUrl, role: "user" }
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role || "guide"
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
                    ; (session.user as any).role = token.role as string
            }
            return session
        },
    },
})

