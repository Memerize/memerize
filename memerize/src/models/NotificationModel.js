import { db } from "@/db/config";

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
      .find({ username })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async createNotification(
    username,
    type,
    message,
    slug,
    mentionUsername
  ) {
    if (!Object.values(NotificationType).includes(type)) {
      throw new Error("Invalid notification type");
    }

    const newNotification = {
      username,
      mentionUsername,
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
}
