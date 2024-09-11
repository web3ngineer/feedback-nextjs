import { z } from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Username/Email cannot be empty" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});
