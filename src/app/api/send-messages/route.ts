import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/model/user.model";
import { rateLimiter } from "@/lib/rateLimiter";

export async function POST(request: NextRequest){
    
    const limitResponse = await rateLimiter(request)
    // console.log(limitResponse.remaining);
    if(limitResponse.remaining === 0){
        // console.log("ok")
        const reset = (limitResponse.reset - Date.now())/1000
        return Response.json( 
            {
                success: false,
                message: "Rate limit exceeds. Too many requests sent"
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limitResponse.limit.toString(),
                    'X-RateLimit-Remaining': limitResponse.remaining.toString(),
                    'X-RateLimit-Reset': `${reset}s`,
                }
            }
        );
    }

    dbConnect();

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        // is user accepting messages
        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success:false,
                message:"User not Accepting Messages"
            },{status:403})
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return NextResponse.json({
            success:true,
            message:"Message Sent Successfully"
        },{status:201})

    } catch (error:any) {
        console.log("An unexpected Error occured:",error)
        return NextResponse.json({
            success:false,
            message:"internal server error:" + error.message
        },{status:500})
    }
}
