import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  
  await dbConnect();
  try {
    const { username, password, password1, password2, code } = await request.json();
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as User;

    // Check if passwords match
    if (password1 !== password2) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }
    
    if(!password && !code){
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 400 }
        );
      }

      if (!user.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User not verified",
          },
          { status: 400 }
        );
      }

      const existingPassword = await bcrypt.compare(password1, user.password)
      if (existingPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "New password cannot be same as old password",
          },
          { status: 400 }
        );
      }

    // If user change-password by using code
    if (code && !password) {
      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = user.verifyCodeExpiry > new Date();

      if (!isCodeValid) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Code",
          },
          { status: 401 }
        );
      }

      if (!isCodeNotExpired) {
        return NextResponse.json(
          {
            success: false,
            message: "Code Expired, Request again to get new code",
          },
          { status: 402 }
        );
      }

      // If OTP is valid and not expired
      if (isCodeNotExpired && isCodeValid) {
        const hashedPassword = await bcrypt.hash(password1, 10);

        const response = await UserModel.findOneAndUpdate(
          { username },
          {
            $unset: {
              verifyCode: "",
              verifyCodeExpiry: "",
            },
            $set: {
              password: hashedPassword,
            },
          },
          { new: true }
        );

        // If update failed
        if (!response) {
          return NextResponse.json(
            {
              success: false,
              message: "Something went wrong! Password not changed",
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: "Password changed successfully",
          },
          { status: 201 }
        );
      }
    }

    // If the user change-password by current-password
    if (!code && password) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: "InCorrect Password",
          },
          { status: 401 }
        );
      }

      // If password is correct
      const hashedPassword = await bcrypt.hash(password1, 10);

      const response = await UserModel.findOneAndUpdate(
        { _id: sessionUser._id },
        {
          $unset: {
            verifyCode: "",
            verifyCodeExpiry: "",
          },
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );

      // If update failed
      if (!response) {
        return NextResponse.json(
          {
            success: false,
            message: "Something went wrong! Password not changed",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Password changed successfully",
        },
        { status: 201 }
      );
    }

  } catch (error: any) {
    console.log("Error in verify code: ", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to change the password",
      },
      { status: 500 }
    );
  }
}
