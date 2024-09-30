import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    const posts = await PostModel.findAllPost(searchQuery);

    return new NextResponse(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
}
