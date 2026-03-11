import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth

    const isAuthPage =
        req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register")

    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/admin") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
