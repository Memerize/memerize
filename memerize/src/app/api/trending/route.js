import { PostModel } from "@/models/PostModel";
import { handleError } from "@/helpers/handleError";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await PostModel.findAllPostByTrending();

    return new NextResponse(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
}
