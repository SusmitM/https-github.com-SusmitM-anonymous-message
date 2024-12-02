import {z} from 'zod';


export const verifyScheam=z.object({
    verifyCode:z.string().length(6,{message:"Verification code must be 6 digits"})
})