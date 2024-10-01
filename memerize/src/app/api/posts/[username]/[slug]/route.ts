import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { username: string; slug: string } }) {
  const { username, slug } = params;
  try {
    const onePost = await PostModel.findOneByUsernameAndSlug(username, slug);

    return NextResponse.json(onePost);
  } catch (error) {
    return handleError(error);
  }
}
