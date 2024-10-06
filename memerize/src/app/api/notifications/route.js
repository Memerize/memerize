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
