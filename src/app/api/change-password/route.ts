import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  
  await dbConnect();
  try {
    const { username, password1, password2, code } = await request.json();
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

    // If user is not logged in
    if (!session || !session.user) {
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

    // If the user is logged in
    if (session && session.user) {
      const user = await UserModel.findById(sessionUser._id);
      
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
