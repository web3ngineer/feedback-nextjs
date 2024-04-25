import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10s'),
})

export const config = {
    runtime: 'edge',
}

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
    }else{

    }

}


