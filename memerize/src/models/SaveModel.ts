import { db } from "@/db/config";
import { SaveTypes } from "@/types";

export class SaveModel {
  static collection(){
    return db.collection<SaveTypes>("saves")
  }

  static async findSaveByUsername(username: string){
    return await this.collection().find({ username }).toArray();
  }

  static async savePost(username: string, slug: string) {
    const existingPost = await this.collection().findOne({ username, slug });
    if (existingPost) {
      throw new Error("Post already saved");
    }
    const createdAt = new Date();
    const updatedAt = new Date();
    return await this.collection().insertOne({ username, slug, createdAt, updatedAt })
  }

  static async removeFromSave(username: string, slug: string) {
    return await this.collection().deleteOne({ username, slug })
  }
}