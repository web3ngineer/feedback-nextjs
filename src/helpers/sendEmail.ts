import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import ForgetPasswordEmail from "../../emails/forgetPasswordEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmail(
  verificationFor: string,
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    let emailTemplate = null;
    if (verificationFor === "verify-email") {
      emailTemplate = VerificationEmail({ username, otp: verifyCode });
    }

    if (verificationFor === "forget-password") {
      emailTemplate = ForgetPasswordEmail({ username, otp: verifyCode });
    }

    if (emailTemplate === null) {
      return {
        success: false,
        message: "email template not found",
      };
    }

    const response = await resend.emails.send({
      from: "noreply@web3ngineer.in",
      to: email,
      subject: "Lukka-Chhuppi | Verification Code",
      react: emailTemplate,
    });
    // console.log(response)

    if (response.data == null) {
      return {
        success: false,
        message: "email server error. Please try again.",
      };
    }

    return {
      success: true,
      message: "Verification code send successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "There was an error sending the verification email",
    };
  }
}
