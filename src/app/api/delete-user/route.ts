import { getServerSession } from "next-auth";
import { authOptions } from "../(auth)/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request){
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
    // in aggregation we need to pass the object id not the string
    try {
        const deletedUser= await UserModel.deleteOne({"_id":user._id})
        console.log(deletedUser)
        if (!deletedUser.deletedCount){
            return NextResponse.json({
                success:false,
                message:"try again! Profile not deleted ",
            },{status:401})
        }

        return NextResponse.json({
            success:true,
            message:"User profile deleted successfully",
        },{status:201})

    } catch (error: any){
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:"User profile not deleted or server error :" + error.message
        },{status:500})
    }
}