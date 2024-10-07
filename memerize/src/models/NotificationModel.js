import { db } from "@/db/config";
import { ObjectId } from "mongodb";

const NotificationType = {
  LIKE: "like",
  MENTION: "mention",
};

export class NotificationModel {
  static collection() {
    return db.collection("notifications");
  }

  static async findByUsername(username) {
    return await this.collection()
      .find({ mentionedUsername: username })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async createNotification(
    postUsername,
    type,
    message,
    slug,
    mentionUsername,
    mentionedUsername
  ) {
    if (!Object.values(NotificationType).includes(type)) {
      throw new Error("Invalid notification type");
    }

    const newNotification = {
      postUsername, // Post creator
      mentionUsername, // The user who is tagging someone
      mentionedUsername, // The user who got tagged
      type,
      message,
      slug,
      isSeen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection().insertOne(newNotification);
    return result.insertedId;
  }

  static async updateNotificationSeen(notificationId, isSeen) {
    return await this.collection().findOneAndUpdate(
      { _id: new ObjectId(notificationId) },
      { $set: { isSeen, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  }
}
