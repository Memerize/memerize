import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { SaveModel } from "@/models/SaveModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  const username = request.headers.get("x-user-username");
  try {
    const savePosts = await SaveModel.findSaveByUsername(username);

    if (!savePosts || savePosts.length === 0) {
      return NextResponse.json(
        { message: "No saved posts found" },
        { status: 404 }
      );
    }

    const slugs = savePosts.map((item) => item.slug);

    const posts = await PostModel.findBySlugs(slugs);

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { message: "No posts found for saved slugs" },
        { status: 404 }
      );
    }

    return NextResponse.json(posts);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { slug } = data;

    const username = request.headers.get("x-user-username");

    if (!username || !slug) {
      return NextResponse.json(
        { message: "Missing username or slug" },
        { status: 400 }
      );
    }

    const result = await SaveModel.toggleSavePost(username, slug);

    if (result.deletedCount) {
      return NextResponse.json({ message: "Post removed from saves" });
    } else {
      return NextResponse.json({ message: "Post saved successfully" });
    }
  } catch (error) {
    return handleError(error);
  }
}
