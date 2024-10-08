import { db } from "@/db/config";

export class SaveModel {
  static collection() {
    return db.collection("saves");
  }

  static async findSaveByUsername(username) {
    return await this.collection().find({ username }).toArray();
  }

  static async findSaveByUsernameAndSlug(username, slug) {
    return await this.collection().findOne({ username, slug });
  }

  static async toggleSavePost(username, slug) {
    const existingSave = await this.findSaveByUsernameAndSlug(username, slug);

    if (existingSave) {
      return await this.removeFromSave(username, slug);
    } else {
      return await this.savePost(username, slug);
    }
  }

  static async savePost(username, slug) {
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
