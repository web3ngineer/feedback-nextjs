import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"User not Authenticated"
        },{status:401})
    }
    // in aggregation we need to pass the object id not the string
    try {
        await UserModel.findByIdAndDelete(user._id)
        return NextResponse.json({
            success:true,
            message:"User profile deleted successfully",
        },{status:401})

    } catch (error: any){
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"User profile not deleted or server error :" + error.message
        },{status:500})
    }
}