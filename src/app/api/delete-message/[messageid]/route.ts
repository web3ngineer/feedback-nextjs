import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, {params}:{ params:{messageid:string}}) {

    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"User not Authenticated"
        },{status:401})
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if(updatedResult.modifiedCount == 0 ){
            return NextResponse.json({
                success:false,
                message:"Message not found or deleted"
            },{status:401})
        }
        return NextResponse.json({
            success:true,
            message:"Message updated successfully",
        },{status:201})

    } catch (error: any){
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"Message delete error :" + error.message,
        },{status:500})
    }
}