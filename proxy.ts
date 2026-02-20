import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

const publicPaths = ["/login", "/signup", "/request-password-reset"];
const adminPaths = ["/admin"];
const userPaths = ["/user"];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isUserPath = userPaths.some((path) => pathname.startsWith(path));

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && user) {
        if (isAdminPath && user.role !== "admin") {
            return NextResponse.redirect(new URL("/user/dashboard", req.url));
        }
        // Block only if NOT citizen AND NOT authority AND NOT admin
        if (isUserPath && user.role !== "citizen" && user.role !== "authority" && user.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (isPublicPath && user) {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/signup",
    ],
};