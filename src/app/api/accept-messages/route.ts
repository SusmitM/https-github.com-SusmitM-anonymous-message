import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  const session = await getServerSession(authOptions);
 
  const user = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  console.log("🚀 ~ POST ~ acceptMessages:", acceptMessages)

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to updated user status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Msg acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to updated user status to accept messages",error);
    return Response.json(
      {
        success: false,
        message: "Failed to updated user status to accept messages",
      },
      { status: 500 }
    );
  }
};



export const GET=async(request:Request)=>{
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try{
    const foundUser:any = await UserModel.findById(userId);
  
    if(!foundUser) {
        // User not found
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      
      // Return the user's message acceptance status
      return Response.json(
        {
          success: true,
          message:"Status fetched",
          isAcceptingMessages: foundUser?.isAcceptingMessage
        },
        { status: 200 }
      );

  }
  catch(error){
    console.error("Error in getting the user message status",error);
    return Response.json(
      {
        success: false,
        message: "Error in getting the user message status",
      },
      { status: 500 }
    );
  }

}
