import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username) // To handle URL encoded characters in the username
        console.log(decodedUsername)
        const user = await UserModel.findOne({username:decodedUsername})
        console.log(user)

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not Found"
            },{status:404})
        }

        if(user.isVerified){
            return NextResponse.json({
                success: true,
                message: "Already User Verified"
            },{status:201})
        }

        const isCodeValid = user.verifyCode === code ; 
        const isCodeNotExpired = user.verifyCodeExpiry > new Date();
        
        if(!isCodeValid){
            return NextResponse.json({
                success: false,
                message: "Invalid Code"
            },{status:401})
        }

        if(!isCodeNotExpired){
            return NextResponse.json({
                success: false,
                message: "Code Expired, Signup again to get new code"
            },{status:402})
        }

        if(isCodeValid && isCodeNotExpired){
            // user.isVerified=true;
            // user.verifyCode+undefined;
            // user.verifyCodeExpiry=undefined;
            // await user.save()

            const response = await UserModel.findOneAndUpdate(
                { username:decodedUsername },
                { 
                    $unset: { 
                        verifyCode:"",
                        verifyCodeExpiry:"",
                    },
                    $set:{
                        isVerified:true
                    },
                },
                { new: true }
            );
            // console.log(nextresponse)
            if (!response) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Failed to update user details",
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "User Verified Successfully"
            },{status:200})
        }

    } catch (error: any) {
        console.log("Error in verify code: ", error.message);
        return NextResponse.json({
                success: false,
                message: "Failed to verify email"
        },{status:500})
    }
}