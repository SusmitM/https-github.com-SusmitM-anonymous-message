import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { JWT } from "next-auth/jwt";


export const authOptions: NextAuthOptions={
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any, req):Promise<any> {
                await dbConnect()
                try{
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("User not found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account")
                    }
                   const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password);
                   if(isPasswordCorrect){
                    return user
                   }
                   else{
                    throw new Error("Incorrect Password")
                   }
                }
                catch(error:any){
                   throw new Error(error)
                }

              }
        })
    ],
    callbacks:{

        async jwt({ token, user }) {
            if(user){
                token._id=user?._id?.toString();
                token.isVerified=user?.isVerified;
                token.username=user?.username;
                token.isAcceptingMessages=user?.isAcceptingMessages;
            }
            return token as JWT & {
                _id?: string;
                isVerified?: boolean;
                username?: string;
                isAcceptingMessages?: boolean;
            }
        },

        async session({ session, token }: { session: any, token: JWT & { 
            _id?: string;
            isVerified?: boolean;
            username?: string;
            isAcceptingMessages?: boolean;
        }}) {
            if(token){
                session.user._id=token?._id
                session.user.isVerified=token?.isVerified
                session.user.username=token?.username
                session.user.isAcceptingMessages=token?.isAcceptingMessages
            }
            return session
          },
        
    },
    pages: {
        signIn: '/auth/signin',
      
      },
      session:{
        strategy:"jwt"
      },
      secret:process.env.NEXTAUTH_SECRET
}