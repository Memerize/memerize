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

export const PostSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  username: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  image: z.string(),
  likes: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  comments: z.array(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CommentSchema = z.object({
  postId: z.string(), // ID dari post yang dikomentari
  username: z.string(),
  content: z.string().min(1, "Content is required"),
  createdAt: z.date().default(() => new Date()),
});