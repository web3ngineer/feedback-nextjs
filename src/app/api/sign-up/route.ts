import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import brcrypt from 'bcryptjs';
import { sendEmail } from "@/helpers/sendEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, res:NextResponse){
    await dbConnect()
    try {
        const {username, email, password} = await req.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified:true})
        if (existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message: `This ${username} username has already been taken.`
            },{status:400})
        };

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        const exstingUserByEmail = await UserModel.findOne({email})
        if(exstingUserByEmail){ 
            if(exstingUserByEmail.isVerified){
                return NextResponse.json(
                    {
                        success: false, 
                        message:"User Exists with the given email"
                    },{status:400})
            }else{
                const hashedPassword = await brcrypt.hash(password, 10)
                exstingUserByEmail.password = hashedPassword;
                exstingUserByEmail.verifyCode = verifyCode;
                exstingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60*60*1000);
                await exstingUserByEmail.save();
            }

        }else{
            const hashedPassword = await brcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode, 
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[],
            })
            await newUser.save()
        };

        //sendVerification email
        const verificationFor = "verify-email"
        const emailResponse = await sendEmail(verificationFor,email, username, verifyCode);
        console.log(emailResponse);

        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:`Failed to send verification mail due to ${emailResponse.message}`
            },{status:500})
        }

        return NextResponse.json(
            {
                success: true, 
                message:"Registration Successfull"
            },{status:200})

    } catch (error) {
        console.error("Error registering User",error);
        return NextResponse.json(
            {
                success: false, 
                message:"Error registering user "
            },
            {
                status:500
            }
        )
    }
}