import { db } from "@/db/config";
import { ObjectId } from "mongodb"; // Import ObjectId untuk konversi

export const CommentModel = {
  async create(commentData) {
    const postId = new ObjectId(commentData.postId);

    // Akses koleksi 'posts'
    const post = await db.collection("posts").findOne({ _id: postId });
    if (!post) {
      throw new Error("Post not found");
    }

    // Komentar baru yang akan ditambahkan
    const newComment = {
      userId: commentData.userId,
      content: commentData.content,
      createdAt: commentData.createdAt,
    };

    // Update post dengan menambahkan komentar baru
    await db.collection("posts").updateOne(
      { _id: postId },
      { $push: { comments: newComment } }
    );

    return newComment;
  },
};
