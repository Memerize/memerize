import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { username, slug } = params;
  try {
    const onePost = await PostModel.findOneByUsernameAndSlug(username, slug);
    if (!onePost) {
      throw new Error("Post not found");
    }
    return NextResponse.json(onePost);
  } catch (error) {
    return handleError(error);
  }
}
