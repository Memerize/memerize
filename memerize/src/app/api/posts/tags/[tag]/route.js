// memerize/src/app/api/posts/tags/[tag]/route.js

import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { tag } = params;

  if (!tag) {
    return NextResponse.json(
      { error: "Tag parameter is required." },
      { status: 400 }
    );
  }

  try {
    const posts = await PostModel.findPostsByTag(tag);

    return NextResponse.json(posts, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts by tag." },
      { status: 500 }
    );
  }
}
