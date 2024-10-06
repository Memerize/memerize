import { NextResponse } from "next/server";
import { NotificationModel } from "@/models/NotificationModel";

export async function POST(request, { params }) {
  const { username: mentionedUsername } = params;
  const { type, slug, postUsername } = await request.json();
  const mentionUsername = request.headers.get("x-user-username");

  if (
    !mentionedUsername ||
    !type ||
    !slug ||
    !mentionUsername ||
    !postUsername
  ) {
    return NextResponse.json(
      {
        error:
          "mentionedUsername, type, mentionUsername, postUsername, and slug are required",
      },
      { status: 400 }
    );
  }

  const message = `${mentionUsername} tagged you in a comment on a post by ${postUsername}.`;

  try {
    const insertedId = await NotificationModel.createNotification(
      postUsername, // Post creator
      "mention", // Notification type
      message,
      slug,
      mentionUsername, // User who mentioned
      mentionedUsername // User who got mentioned
    );
    return NextResponse.json({ insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}
