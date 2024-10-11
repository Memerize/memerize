import { NextResponse } from "next/server";
import { NotificationModel } from "@/models/NotificationModel";
import { handleError } from "@/helpers/handleError";

export async function GET(request) {
  const username = request.headers.get("x-user-username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const notifications = await NotificationModel.findByUsername(username);
    return NextResponse.json(notifications);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const { mentionedUsername, type, slug, postUsername, commentId } =
      await request.json();
    const mentionUsername = request.headers.get("x-user-username");

    if (
      !mentionedUsername ||
      !type ||
      !slug ||
      !mentionUsername ||
      !postUsername ||
      !commentId
    ) {
      return NextResponse.json(
        {
          error:
            "mentionedUsername, type, mentionUsername, postUsername, slug, and commentId are required",
        },
        { status: 400 }
      );
    }

    const message = `${mentionUsername} tagged you in a comment on a post by ${postUsername}.`;

    // Create the notification with commentId included
    const insertedId = await NotificationModel.createNotification({
      postUsername, // Post creator
      mentionUsername, // The user who is tagging someone
      mentionedUsername, // The user who got tagged
      type,
      message,
      slug,
      commentId, // Include commentId
      isSeen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ insertedId });
  } catch (error) {
    return handleError(error);
  }
}
