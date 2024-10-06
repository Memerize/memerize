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
  const { type, message, slug } = await request.json();
  const username = request.headers.get("x-user-username");

  if (!username || !type || !message || !slug) {
    return NextResponse.json(
      { error: "Username, type, message, and slug are required" },
      { status: 400 }
    );
  }

  try {
    const insertedId = await NotificationModel.createNotification(
      username,
      type,
      message,
      slug
    );
    return NextResponse.json({ insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}
