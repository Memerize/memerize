import { NextResponse } from "next/server";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import { handleError } from "@/helpers/handleError";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  const { slug } = params;
  const { content } = await request.json();
  const username = request.headers.get("x-user-username");

  try {
    const post = await PostModel.findOneBySlug(slug);
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const newComment = {
      commentId: new ObjectId(),
      username: user.username,
      content,
      replies: [],
      commentLikes: [],
    };

    const updatedPost = await PostModel.addComment(slug, newComment);

    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];
    return NextResponse.json(addedComment);
  } catch (error) {
    return handleError(error);
  }
}
