import dbConnect from "@/lib/dbConnect"
import UserModel, { Message } from "@/model/User";
import { User } from "next-auth";

export const POST=async(request:Request)=>{
    await dbConnect();

    const {username,content}=await request.json();
    try{
        const user:any =await UserModel.findOne({username}) ;
      
        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },
        {status:404})
        }
     
        if (!user.isAcceptingMessage) {

            return Response.json({
                success:false,
                message:'User not accepting messages'
            },
        {status:403})
        }

        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message:'Message send successfully'
        },
    {status:200})
    }
    catch(error){
        console.error("Error while sending message",error)
        return Response.json({
            success:false,
            message:'Internal Server Error'
        },
    {status:500})
    }

}