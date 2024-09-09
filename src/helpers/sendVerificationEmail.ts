import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'noreply@web3ngineer.in',
            to: email,
            subject: "Feedback Message | Verification Code",
            react: VerificationEmail({username, otp:verifyCode}),
          });
        // console.log(response)

        if(response.data == null){
            return {
                success: false,
                message:"email server error. Please try again."
            }
        }

        return {
            success: true,
            message:"Verification code send successfully"
        }
        
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {
            success: false,
            message:"There was an error sending the verification email"
        }
    }
}