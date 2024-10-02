import { db } from "@/db/config";
import { UserModel } from "./UserModel";

export class PostModel {
  static collection() {
    return db.collection("posts");
  }

  static async findAllPost(searchQuery) {
    if (searchQuery) {
      return await this.collection()
        .find({
          title: { $regex: searchQuery, $options: "i" },
        })
        .toArray();
    }
    return await this.collection().find().sort({ createdAt: -1 }).toArray();
  }

  static async findByTitle(title) {
    return await this.collection().findOne({ title: title });
  }

  static async create(postData) {
    return this.collection().insertOne(postData);
  }

  static async findAllByUsername(username) {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    return await this.collection()
      .find({ username })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findOneByUsernameAndSlug(username, slug) {
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
