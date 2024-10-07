// memerize/src/app/api/posts/tags/route.js

import { PostModel } from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tagStats = await PostModel.getTagStatistics();

    const formattedTagStats = tagStats.map((tag) => ({
      tag: tag._id,
      count: tag.count,
    }));

    return NextResponse.json(formattedTagStats, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching tag statistics:", error);
    return NextResponse.json(
      { error: "Failed to get statistic tags." },
      { status: 500 }
    );
  }
}
