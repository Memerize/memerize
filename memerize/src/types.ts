import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().optional().default("Anonymous"),
  username: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be 5 characters"),
  image: z
    .string()
    .default(
      "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
    ),
});

export type UserTypes = z.infer<typeof UserSchema>;
