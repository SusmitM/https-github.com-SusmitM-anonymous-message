import {z} from 'zod';


export const signInSchema=z.object({
    identifier:z.string(),
    password:z.string().min(1,{message:"Please Enter an Password"}),
    
})