import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';


export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
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
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
    // return NextResponse.redirect(new URL('/home', request.url))
}
