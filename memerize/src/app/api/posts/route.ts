import { createSlug } from "@/action";
import { handleError } from "@/helpers/handleError";
import { PostModel } from "@/models/PostModel";
import { PostSchema } from "@/types";
import { ObjectId } from "mongodb";
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

export async function POST(request: Request) {
  try {
    const body = await request.json(); // title, image, tags
    const userId = new ObjectId(body.userId); // userId masih hardcode
    
    const parsedData = PostSchema.parse({
      ...body,
      userId,
    });

    const slug = await createSlug(parsedData.title); 

    const postData = {
      ...parsedData,
      slug,
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newPost = await PostModel.create(postData);

    return new NextResponse(JSON.stringify(newPost), {
      headers: { 
        "Content-Type": "application/json" 
      }
    });
  } catch (error) {
    return handleError(error);
  }
}