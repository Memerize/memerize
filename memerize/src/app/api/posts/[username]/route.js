import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { username } = params;
  try {
    const posts = await PostModel.findAllByUsername(username);
    return NextResponse.json(posts);
  } catch (error) {
    return handleError(error);
  }
}
