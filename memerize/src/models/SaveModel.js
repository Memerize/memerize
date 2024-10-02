import { db } from "@/db/config";

export class SaveModel {
  static collection() {
    return db.collection("saves");
  }

  static async findSaveByUsername(username) {
    return await this.collection().find({ username }).toArray();
  }

  static async savePost(username, slug) {
    const existingPost = await this.collection().findOne({ username, slug });
    if (existingPost) {
      throw new Error("Post already saved");
    }
    const createdAt = new Date();
    const updatedAt = new Date();
    return await this.collection().insertOne({
      username,
      slug,
      createdAt,
      updatedAt,
    });
  }

  static async removeFromSave(username, slug) {
    return await this.collection().deleteOne({ username, slug });
  }
}
