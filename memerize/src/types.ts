import { ObjectId } from "mongodb";
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

const PostSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId),
  title: z.string(),
  image: z.string(),
  likes: z.array(z.any()),
  tags: z.array(z.string()),
  comments: z.array(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PostTypes = z.infer<typeof PostSchema>;
