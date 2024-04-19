import { dbConnect } from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/Schemas/signUpSchema";


export async function POST(request: Request){
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username) // To handle URL encoded characters in the username
        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not Found"
            },{status:400})
        }

        const isCodeValid = await user.verifyCode === code ; 
        const isCodeNotExpired = await user.verifyCodeExpiry > new Date();
        if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Invalid Code"
            },{status:400})
        }

        if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Code Expired, Signup again to get new code"
            },{status:400})
        }

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true;
            await user.save()

            return Response.json({
                success: true,
                message: "User Verified Successfully"
            },{status:200})
        }

    } catch (error: any) {
        console.log("Error in verify code: ", error.message);
        return Response.json({
                success: false,
                message: "Failed to verify email"
        },{status:500})
    }
}