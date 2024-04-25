import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)// To handle URL encoded characters in the username
        const user = await UserModel.findOne({username:decodedUsername})
        // console.log(user)

        if(!user){
            return Response.json({
                success: false,
                message: "User not Found"
            },{status:400})
        }

        if(user.isVerified){
            return Response.json({
                success: true,
                message: "Already User Verified"
            },{status:200})
        }

        const isCodeValid = user.verifyCode === code ; 
        const isCodeNotExpired = user.verifyCodeExpiry > new Date();
        
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
            // user.isVerified=true;
            // user.verifyCode+undefined;
            // user.verifyCodeExpiry=undefined;
            // await user.save()

            const response = await UserModel.findOneAndUpdate(
                { username },
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
            // console.log(response)

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