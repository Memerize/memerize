import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { SaveModel } from "@/models/SaveModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  const username = "username test"; // harusnya dari request headers (request.headers.get("x-user-username"))
  try {
    const savePosts = await SaveModel.findSaveByUsername(username);
    const slugs = savePosts.map((item) => item.slug);
    const posts = await PostModel.collection()
      .find({ slug: { $in: slugs } })
      .toArray();
    return NextResponse.json(posts);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { slug } = data;
    const username = "username test"; // masih hardcode (request.headers.get("x-user-username"))
    await SaveModel.savePost(username, slug);
    return NextResponse.json({ message: "Post has been saved" });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    const { slug } = data;
    const username = "username test"; // masih hardcode (request.headers.get("x-user-username"))

    if (!username || !slug) {
      return NextResponse.json(
        { message: "Missing username or slug" },
        { status: 400 }
      );
    }

    await SaveModel.removeFromSave(username, slug);
    return NextResponse.json({ message: "Post removed from save" });
  } catch (error) {
    return handleError(error);
  }
}
