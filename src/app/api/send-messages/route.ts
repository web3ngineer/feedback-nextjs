import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/model/user.model";
import { rateLimitMiddleware } from "@/middleware";

export async function POST(request: NextRequest){

    dbConnect();
    rateLimitMiddleware(request)

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
