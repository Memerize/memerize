import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { slug } = params;
  const username = "username test"; // Ganti dengan username dari request headers

  try {
    // Temukan post berdasarkan slug
    const post = await PostModel.findOne({ slug });
    if (!post) {
      throw new Error("Post not found");
    }

    // Cek apakah user sudah menyukai post ini
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      // Jika sudah disukai, hapus username dari array likes
      post.likes = post.likes.filter((like) => like !== username);
    } else {
      // Jika belum disukai, tambahkan username ke dalam array likes
      post.likes.push(username);
    }

    // Update post dengan likes yang baru
    await PostModel.collection().updateOne(
      { slug },
      { $set: { likes: post.likes } }
    );

    return NextResponse.json({ message: alreadyLiked ? "Like removed" : "Post liked successfully" });
  } catch (error) {
    return handleError(error);
  }
}