import { z } from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Username/Email is Required" }),
  password: z.string().min(1, { message: "Password is Required" }),
});
