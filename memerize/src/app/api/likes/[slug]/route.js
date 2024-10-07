import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { slug } = params;
  const username = request.headers.get("x-user-username");

  try {
    const post = await PostModel.findOneBySlug(slug);
    if (!post) {
      throw new Error("Post not found");
    }

    const alreadyLiked = post.likes.includes(username);
    const updateOperation = alreadyLiked
      ? { $pull: { likes: username } }
      : { $addToSet: { likes: username } };

    await PostModel.collection().updateOne({ slug }, updateOperation);

    return NextResponse.json({
      message: alreadyLiked ? "Upvote removed" : "Post upvoted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
