import {z} from 'zod'

export const changePasswordSchema = z.object({
    code: z.string().length(6,"Code must be 6 characters long"),
    password1: z.string().min(6, {message:"Password should have minimum length of 6"}),
    password2: z.string().min(6, {message:"Password should have minimum length of 6"}),
}).refine((data) => data.password1 === data.password2,{
    message:"Passwords do not match",
    path:["password2"]
})