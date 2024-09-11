import UserModel from "@/model/user.model";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { sendEmail } from "@/helpers/sendEmail";

export async function POST(request: Request) {

    await dbConnect();
    const { email } = await request.json();

    try {
        const user = await UserModel.findOne({ email }).select("-messages -password");
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not Found",
            },{status:400});
        }

        if(!user.isVerified){
            return NextResponse.json({
                success: false,
                message: "User not verified! Please verify first",
            },{status:400});
        }

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const expiryDate = new Date()
            expiryDate.setMinutes(expiryDate.getMinutes() + 10)   // Valid for only 10 minutes

        const response = await UserModel.findByIdAndUpdate(
            user._id,
            { 
                verifyCode, 
                verifyCodeExpiry: expiryDate 
            },
            { new: true }
        )

        if (!response) {
            return NextResponse.json({
                success: false,
                message: "Unable to generate code",
            },{status:400});
        }

        // send email
        const verificationFor = "forget-password"
        const emailResponse = await sendEmail(verificationFor, user.email, user.username, verifyCode);
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:`Failed to send verification mail due to ${emailResponse.message}`
            },{status:500})
        }

        return NextResponse.json({
            success: true, 
            message: "Password reset link & otp sent to your email",
            user:user,
        },{status:201});


    } catch (error:any) {
        console.error("Error! Forget Password",error);
        return NextResponse.json({
                success: false, 
                message:"Error! Forget Password "
        },{status:500 });
    }    
}