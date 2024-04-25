import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// export { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
    runtime: 'edge',
}

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10s'),
})


export default async function handler(request: NextRequest){

    const ip = request.ip ?? '127.0.0.1'

    const limitResponse = await ratelimit.limit(ip)
    if(!limitResponse.remaining){
        return Response.json(
            {
                success: false,
                message: "Rate limit exceeds. Too many requests send"
            },
            {
                status:429,
                headers:{
                    'X-RateLimit-Limit': limitResponse.limit.toString(),
                    'X-RateLimit-Remaining': limitResponse.remaining.toString(),
                    'X-RateLimit-Reset': limitResponse.reset.toString(),
                }
            }
        ) 
    }
    return NextResponse.next()
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request, secret:process.env.NEXT_AUTH_SECRET}) // Get the user's JWT token from the cookie.
    // console.log(token)
    const url = request.nextUrl

    if(token && 
        (
            url.pathname.startsWith('/sign-in') || 
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')  ||
            url.pathname === '/'
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL( "/sign-in", request.url))
    }
    return NextResponse.next()
    // return NextResponse.redirect(new URL('/home', request.url))
}
