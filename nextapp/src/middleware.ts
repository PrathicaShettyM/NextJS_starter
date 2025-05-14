import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// for route protection
export function middleware(request: NextRequest){
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

    const token = request.cookies.get('token')?.value || ''

    // if user is already logged in
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/', request.nextUrl))
    } 

    // if the user needs to login
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }




}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
}