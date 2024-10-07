import { NextResponse } from "next/server";
import { NotificationModel } from "@/models/NotificationModel";

export async function PATCH(request, { params }) {
  const { _id } = params;
  const { isSeen } = await request.json();

  if (typeof isSeen === "undefined") {
    return NextResponse.json(
      { error: "isSeen field is required" },
      { status: 400 }
    );
  }

  try {
    const updatedNotification = await NotificationModel.updateNotificationSeen(
      _id,
      isSeen
    );
    
    return NextResponse.json({ success: true, updatedNotification });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
