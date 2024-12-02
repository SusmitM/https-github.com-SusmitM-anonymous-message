import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 character")
  .max(25, "Username must be no more than 25 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid EmailId'}),
    password:z.string().min(6,{message:"password should be minimum 6 characters"}),
})
