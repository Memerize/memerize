import { db } from "@/db/config";
import { PostTypes } from "@/types";

export class PostModel {
  static collection() {
    return db.collection<PostTypes>("posts");
  }

  static async findAllPost(searchQuery?: string) {
    if (searchQuery) {
      return await this.collection()
        .find({
          title: { $regex: searchQuery, $options: "i" },
        })
        .toArray();
    }
    return await this.collection().find().sort({ createdAt: -1 }).toArray();
  }

  static async findByTitle(title: string) {
    return await this.collection().findOne({ title: title });
  }

  static async create(postData: PostTypes) {
    return this.collection().insertOne(postData);
  }
}
