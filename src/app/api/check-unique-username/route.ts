import { dbConnect } from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { NextRequest } from "next/server";



const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest){

    // if(request.method !== 'GET'){
    //     Response.json({
    //         success: false,
    //         message:"Invalid request method! ONLY GET ALLOWED"
    //     },{status:405})
    // }

    await dbConnect();
    try {
        // localhost:3000/api/check-unique-username?username=test123456789&id=123456789
        // const { searchParams } = new URL(request.url);  // Get the query params in the url

        const url = request.nextUrl;
        const queryParam = {
            username: url.searchParams.get('username')
        }
        
        // validate with zod
        const result =  UsernameQuerySchema.safeParse(queryParam) 


        // console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];   // get only the error message for the username field

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors : "Invalid request",
            },{status:400})
        }

        const { username } = result.data
        const existingVerifiedUser = await  UserModel.findOne({ username }) 
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message:"Username is already taken"
            },{status:400})
        }

        return Response.json({
            success: true,
            message:"Username is available"
        },{status:200})


    } catch (error:any) {
        console.log("Error in getting user data : ", error.message);
        return Response.json({
                success: false,
                message: "Failed to check the username"
        },{status:500})
    }
}