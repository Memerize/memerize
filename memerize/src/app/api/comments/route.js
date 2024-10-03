import { handleError } from "@/helpers/handleError";
import { CommentModel } from "@/models/CommentModel";
import { UserModel } from "@/models/UserModel";
import { PostModel } from "@/models/PostModel";
import { CommentSchema } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received comment data:", body);
    const parsedData = CommentSchema.parse(body);

    // Ambil userId berdasarkan username
    const user = await UserModel.findOne({ username: parsedData.username });
    if (!user) {
      throw new Error("User not found");
    }

    // Buat komentar baru dan tambahkan langsung ke post
    const newComment = {
      userId: user._id, 
      content: parsedData.content,
      createdAt: new Date(),
    };

    // Tambahkan komentar ke dalam post
    await PostModel.addComment(parsedData.postId, newComment);

    return new NextResponse(JSON.stringify(newComment), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
