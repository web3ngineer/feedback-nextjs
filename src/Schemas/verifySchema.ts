import {z} from 'zod'

export const verifyCodeSchema = z.object({
    code: z.string().min(1, { message: "Required" }).length(6,"Code must be 6 characters long"),
});

export const verifyEmailSchema = z.object({
    email: z.string().min(1, { message: "Required" }).email({message:"Invalid Email"}),
});