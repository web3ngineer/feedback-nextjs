import { getServerSession } from "next-auth";
import { authOptions } from "../(auth)/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User
    // console.log(user)

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"User not Authenticated"
        },{status:401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    // in aggregation we need to pass the object id not the string
    try {
        const user = await UserModel.aggregate([
            {$match:{_id: userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        ]).exec()
        // console.log(user)

        if(!user || user.length === 0){
            return NextResponse.json({
                success:false,
                message:"There is no message"
            },{status:401})
        }
        return NextResponse.json({
            success:true,
            message:"User data fetched successfully",
            messages:user[0].messages
        },{status:201})

    } catch (error: any){
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"User not found or server error :" + error.message
        },{status:500})
    }
}