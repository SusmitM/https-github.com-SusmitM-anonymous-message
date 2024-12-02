import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest):Promise<Response> {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Checking if an User already exists with the provided Username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Finding User By Email
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json(
                { success: false, message: "User already exists with this email" },
                { status: 400 }
              );
        }
        else{
             //Create an new user with the provided email
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password=hashedPassword
      existingUserByEmail.verifyCode=verifyCode;
      existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)

      await existingUserByEmail.save()
        }
    } else {
      //Create an new user with the provided email
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating an Expiry Date of 1 hour from creation
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
