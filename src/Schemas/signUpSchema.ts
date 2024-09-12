import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(1,"Username is Required")
    .min(5, "Username must be at least 5 characters long. ")
    .max(20, "Username cannot exceed 20 characters. ")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters & white spacing.")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().min(1,"Email is Required").email({message:"Invalid Email"}),
    password: z.string().min(1,"Password is Required").min(6, {message:"Password should have minimum length of 6"}),
})