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
      "https://res.cloudinary.com/dlj1xpqqa/image/upload/v1728276780/k48t01fbihbdgzoa8qer.png"
    ),
});

export const PostSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  username: z.string(),
  profileImage: z.string().optional(),
  title: z.string(),
  slug: z.string().optional(),
  image: z.string(),
  likes: z.array(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  comments: z.array(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
