import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as User;

    // If user is not logged in
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request",
        },
        { status: 400 }
      );
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

      const existingUser = await UserModel.findOne({ username });
      // console.log(existingUser)

      if ( existingUser && user.email !== existingUser?.email) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already exists",
          },
          { status: 400 }
        );
      }

      if ( existingUser && user.username === existingUser?.username) {
        return NextResponse.json(
          {
            success: false,
            message: "Same as the Current Username",
          },
          { status: 400 }
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: "InCorrect Password",
          },
          { status: 401 }
        );
      }

      const response = await UserModel.findOneAndUpdate(
        { _id: sessionUser._id },
        {
          $set: {
            username,
          },
        },
        { new: true }
      );

      // If update failed
      if (!response) {
        return NextResponse.json(
          {
            success: false,
            message: "Something went wrong! Username not changed",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Username changed successfully",
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.log("Error! username not changed: ", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to change username",
      },
      { status: 500 }
    );
  }
}
