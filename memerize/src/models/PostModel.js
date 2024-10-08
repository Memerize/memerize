import { db } from "@/db/config";
import { ObjectId } from "mongodb";

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

  static async findOneBySlug(slug) {
    return await this.collection().findOne({ slug: slug });
  }

  static async create(postData) {
    return this.collection().insertOne(postData);
  }

  static async findAllByUsername(username) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            username: username,
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
          $sort: {
            createdAt: -1,
          },
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
        },
      ])
      .toArray();
  }

  static async findBySlugs(slugs) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            slug: { $in: slugs }, // Match slugs array
          },
        },
        // Lookup for user who created the post
        {
          $lookup: {
            from: "users", // Assuming the users collection has user profile data
            localField: "username",
            foreignField: "username",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Ensure that the user data is a single object, not an array
        },
        // Lookup for user details in comments
        {
          $lookup: {
            from: "users",
            localField: "comments.username",
            foreignField: "username",
            as: "commentUserDetails",
          },
        },
        // Lookup for user details in replies
        {
          $lookup: {
            from: "users",
            localField: "comments.replies.username",
            foreignField: "username",
            as: "replyUserDetails",
          },
        },
        // Add userImage for comments and replies
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  $mergeObjects: [
                    "$$comment",
                    {
                      userImage: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUserDetails",
                              as: "userDetail",
                              cond: {
                                $eq: [
                                  "$$userDetail.username",
                                  "$$comment.username",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                      replies: {
                        $map: {
                          input: "$$comment.replies",
                          as: "reply",
                          in: {
                            $mergeObjects: [
                              "$$reply",
                              {
                                userImage: {
                                  $arrayElemAt: [
                                    {
                                      $filter: {
                                        input: "$replyUserDetails",
                                        as: "userDetail",
                                        cond: {
                                          $eq: [
                                            "$$userDetail.username",
                                            "$$reply.username",
                                          ],
                                        },
                                      },
                                    },
                                    0,
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        // Project the final data
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            tags: 1,
            slug: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
            comments: {
              commentId: 1,
              username: 1,
              content: 1,
              commentLikes: 1,
              createdAt: 1,
              updatedAt: 1,
              userImage: {
                _id: 1,
                email: 1,
                name: 1,
                username: 1,
                image: 1,
              },
              replies: {
                username: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                userImage: {
                  _id: 1,
                  email: 1,
                  name: 1,
                  username: 1,
                  image: 1,
                },
              },
            },
            "user._id": 1,
            "user.name": 1,
            "user.username": 1,
            "user.email": 1,
            "user.image": 1,
          },
        },
      ])
      .toArray(); // Return all matching posts
  }

  static async findOneByUsernameAndSlug(username, slug) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            username: username,
            slug: slug,
          },
        },
        {
          $lookup: {
            from: "users", // Assuming the users collection has user profile data
            localField: "username",
            foreignField: "username",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "users", // Lookup for comment user details
            localField: "comments.username",
            foreignField: "username",
            as: "commentUserDetails",
          },
        },
        {
          $lookup: {
            from: "users", // Lookup for reply user details
            localField: "comments.replies.username",
            foreignField: "username",
            as: "replyUserDetails",
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  $mergeObjects: [
                    "$$comment",
                    {
                      userImage: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$commentUserDetails",
                              as: "userDetail",
                              cond: {
                                $eq: [
                                  "$$userDetail.username",
                                  "$$comment.username",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                      replies: {
                        $map: {
                          input: "$$comment.replies",
                          as: "reply",
                          in: {
                            $mergeObjects: [
                              "$$reply",
                              {
                                userImage: {
                                  $arrayElemAt: [
                                    {
                                      $filter: {
                                        input: "$replyUserDetails",
                                        as: "userDetail",
                                        cond: {
                                          $eq: [
                                            "$$userDetail.username",
                                            "$$reply.username",
                                          ],
                                        },
                                      },
                                    },
                                    0,
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            tags: 1,
            slug: 1,
            comments: {
              commentId: 1,
              username: 1,
              content: 1,
              replies: {
                username: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "userImage._id": 1,
                "userImage.email": 1,
                "userImage.name": 1,
                "userImage.username": 1,
                "userImage.image": 1,
              },
              commentLikes: 1,
              createdAt: 1,
              updatedAt: 1,
              "userImage._id": 1,
              "userImage.email": 1,
              "userImage.name": 1,
              "userImage.username": 1,
              "userImage.image": 1,
            },
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
            "user._id": 1,
            "user.name": 1,
            "user.username": 1,
            "user.email": 1,
            "user.image": 1,
          },
        },
      ])
      .next();
  }

  static async addComment(slug, comment) {
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    return await this.collection().findOneAndUpdate(
      { slug },
      {
        $push: { comments: comment },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
  }

  static async addReplyToComment(slug, commentId, reply) {
    return await this.collection().findOneAndUpdate(
      {
        slug: slug,
        "comments.commentId": new ObjectId(String(commentId)),
      },
      {
        $push: { "comments.$.replies": reply },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
  }

  static async getTagStatistics() {
    return await this.collection()
      .aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
  }

  static async findPostsByTag(tag) {
    try {
      const posts = await this.collection()
        .aggregate([
          { $match: { tags: tag } }, // Filter posts that include the tag
          {
            $lookup: {
              from: "users",
              localField: "username",
              foreignField: "username",
              as: "user",
            },
          },
          { $unwind: "$user" }, // Convert user array to object
          { $sort: { createdAt: -1 } }, // Sort by newest first
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
          },
        ])
        .toArray();

      return posts;
    } catch (error) {
      console.error(`Error fetching posts with tag "${tag}":`, error);
      throw new Error("Failed to fetch posts by tag.");
    }
  }
}
