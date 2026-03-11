import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import { prisma } from "./db"
import { checkRateLimit, resetRateLimit } from "./rate-limit"

export const { handlers: userHandlers, signIn: userSignIn, signOut: userSignOut, auth: userAuth } = NextAuth({
    session: { strategy: "jwt" },
    pages: { signIn: "/entrar" },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const email = credentials.email as string
                const rl = checkRateLimit(`user-login:${email}`)
                if (!rl.allowed) return null

                const user = await prisma.appUser.findUnique({ where: { email } })
                if (!user?.password) return null

                const valid = await bcryptjs.compare(credentials.password as string, user.password)
                if (!valid) return null

                resetRateLimit(`user-login:${email}`)
                return { id: user.id, email: user.email, name: user.name, image: user.avatarUrl }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) { token.id = user.id; token.role = "user" }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    cookies: {
        sessionToken: { name: "PATHY-user-session", options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" } },
    },
})
