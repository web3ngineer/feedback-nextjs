import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User

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
            {$match:{id: userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        ])

        if(!user || user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:401})
        }
        return NextResponse.json({
            success:true,
            message:"User data fetched successfully",
            data:user[0].messages
        },{status:401})

    } catch (error: any){
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"User not  found or server error :" + error.message
        },{status:500})
    }
}