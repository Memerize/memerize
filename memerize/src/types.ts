import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  username: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be 5 characters"),
});

export type UserTypes = z.infer<typeof UserSchema>;
