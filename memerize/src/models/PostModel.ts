import { db } from "@/db/config";
import { PostTypes } from "@/types";
import { UserModel } from "./UserModel";

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

  static async findAllByUsername(username: string) {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    return await this.collection().find({ username }).sort({ createdAt: -1 }).toArray();
  }

  static async findOneByUsernameAndSlug(username: string, slug: string) {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
    
    return await this.collection().findOne({
      username: username,
      slug: slug,
    });
  }
}
