import { db } from "@/db/config";
import { UserModel } from "./UserModel";

export class PostModel {
  static collection() {
    return db.collection("posts");
  }

  static async findAllPost(searchQuery) {
    const pipeline = [];

    if (searchQuery) {
      pipeline.push({
        $match: {
          title: { $regex: searchQuery, $options: "i" },
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "username",
          foreignField: "username",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          tags: 1,
          slug: 1,
          comments: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.name": 1,
          "user.username": 1,
          "user.email": 1,
          "user.image": 1,
        },
      }
    );

    return await this.collection().aggregate(pipeline).toArray();
  }

  static async findTopPost() {
    return await this.collection()
      .aggregate([
        {
          $addFields: {
            totalInteraction: {
              $add: [{ $size: "$likes" }, { $size: "$comments" }],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: { totalInteraction: -1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            tags: 1,
            slug: 1,
            createdAt: 1,
            comments: 1,
            likes: 1,
            totalInteraction: 1,
            "user.name": 1,
            "user.username": 1,
            "user.email": 1,
            "user.image": 1,
          },
        },
      ])
      .toArray();
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
          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: { totalInteraction: -1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            tags: 1,
            slug: 1,
            createdAt: 1,
            comments: 1,
            likes: 1,
            totalInteraction: 1,
            "user.name": 1,
            "user.username": 1,
            "user.email": 1,
            "user.image": 1,
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
