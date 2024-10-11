import { NextResponse } from "next/server";
import { PostModel } from "@/models/PostModel";
import { handleError } from "@/helpers/handleError";

export async function POST(request, { params }) {
  const { slug, commentId } = params;
  const { content } = await request.json();
  const username = request.headers.get("x-user-username");

  try {
    const newReply = {
      username: username,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await PostModel.addReplyToComment(slug, commentId, newReply);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to add reply" },
        { status: 400 }
      );
    }

    return NextResponse.json(newReply);
  } catch (error) {
    return handleError(error);
  }
}
