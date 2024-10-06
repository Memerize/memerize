import { NextResponse } from "next/server";
import { NotificationModel } from "@/models/NotificationModel";

export async function POST(request, { params }) {
  const { username } = params;
  const { type, slug } = await request.json();
  const mentionUsername = request.headers.get("x-user-username");

  if (!username || !type || !slug || !mentionUsername) {
    return NextResponse.json(
      {
        error: "Username, type, mentionUsername, and slug are required",
      },
      { status: 400 }
    );
  }

  const message = `${mentionUsername} is tagging you.`;

  try {
    const insertedId = await NotificationModel.createNotification(
      username,
      type,
      message,
      slug,
      mentionUsername
    );
    return NextResponse.json({ insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}
