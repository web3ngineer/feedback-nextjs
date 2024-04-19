import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"User not Authenticated"
        },{status:401})
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return NextResponse.json({
                success:false, 
                message:"Failed to update user message"
            }, { status: 401 })
        }

        return  NextResponse.json({
            success: true,
            message: "Message acceptance status updated successfully",
            date: updatedUser
        },{status:200})

    } catch (error:any) {
        console.log(error.message);
        return NextResponse.json({
            success:false, 
            message:"failed to update user status to accept messages"
        }, { status: 500 })
    }


}

export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"User not Authenticated"
        },{status:401})
    }

    const userId = user._id;

    try {
        const foundUser = await  UserModel.findById(userId).select("-password");
        if (!foundUser) {
            return NextResponse.json({
                success: false,
                message: 'User not Found'
            },{status:401});
        } 
    
        return NextResponse.json({
            success: false,
            isAcceptingMessages:foundUser.isAcceptingMessage,
            data:foundUser
        },{status:200});
        
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:500})
    }
}

