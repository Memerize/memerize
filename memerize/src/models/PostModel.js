import { db } from "@/db/config";
import { UserModel } from "./UserModel";
import { ObjectId } from "mongodb"; // Import ObjectId untuk konversi

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

  static async findAllPostByTrending() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return await this.collection()
      .aggregate([
        {
          $match: {
            createdAt: { $gte: oneWeekAgo },
          },
        },
        {
          $addFields: {
            totalInteraction: {
              $add: [{ $size: "$likes" }, { $size: "$comments" }],
            },
          },
        },
        {
          $sort: { totalInteraction: -1 },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            title: 1,
            image: 1,
            tags: 1,
            slug: 1,
            createdAt: 1,
            comments: 1,
            likes: 1,
            totalInteraction: 1,
          },
        },
      ])
      .toArray();
  }

  static async findByTitle(title) {
    return await this.collection().findOne({ title: title });
  }

  static async create(postData) {
    return this.collection().insertOne(postData);
  }

  static async findOne(query) {
    return await this.collection().findOne(query);
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

  // Tambahkan comment ke dalam post
  static async addComment(postId, comment) {
    const objectId = new ObjectId(postId);

    // Tambahkan createdAt dan updatedAt ke komentar
    const commentWithTimestamps = {
      ...comment,
      createdAt: new Date(),  // Menggunakan new Date() untuk createdAt
      updatedAt: new Date(),  // Menggunakan new Date() untuk updatedAt
    };

    // Temukan post berdasarkan ID
    const post = await this.collection().findOne({ _id: objectId });
    if (!post) {
      throw new Error("Post not found");
    }

    // Cek apakah komentar sudah ada
    const existingComment = post.comments.find(
      (c) => c.userId === commentWithTimestamps.userId && c.content === commentWithTimestamps.content
    );
    
    if (existingComment) {
      throw new Error("Comment already exists");
    }

    // Update post dengan menambahkan komentar baru ke array comments
    const updateResult = await this.collection().updateOne(
      { _id: objectId },
      { $push: { comments: commentWithTimestamps } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to add comment");
    }

    return commentWithTimestamps;
  }
}
