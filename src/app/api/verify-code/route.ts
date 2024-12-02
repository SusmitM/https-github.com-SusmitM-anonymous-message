import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    if (!username || !code) {
      return Response.json(
        {
          success: false,
          message: "Parameters missing, please provide the username and code",
        },
        { status: 400 }
      );
    }
    const decodedUsername = decodeURI(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found with this username",
        },
        { status: 400 }
      );
    }
    const verifyCode = user?.verifyCode;
    const verifyCodeExpiry = user?.verifyCodeExpiry;

    const isCodeValid = verifyCode === code;
    const isCodeExpired = new Date() > new Date(verifyCodeExpiry);

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (isCodeExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Unable to verify user", error);
    return Response.json(
      { success: false, message: "Unable to verify user" },
      { status: 500 }
    );
  }
};
