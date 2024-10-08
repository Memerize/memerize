import { createSlug } from "@/action";
import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { PostSchema } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request) {
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

export async function POST(request) {
  try {
    const body = await request.json(); // title, image, tags
    const username = request.headers.get("x-user-username");
    const parsedData = PostSchema.parse({
      ...body,
      username,
    });

    const slug = await createSlug(parsedData.title);
    const uniqueSlug = `${slug}-${Date.now()}`;

    const postData = {
      ...parsedData,
      slug: uniqueSlug,
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newPost = await PostModel.create(postData);

    return new NextResponse(JSON.stringify(newPost), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
