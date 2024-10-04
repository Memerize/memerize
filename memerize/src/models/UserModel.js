import { db } from "@/db/config";
import { hashPassword } from "@/helpers/jwt-bcrypt";
import { UserSchema } from "@/types";
import { ObjectId } from "mongodb";

export class UserModel {
  static collection() {
    return db.collection("users");
  }

  // menampilkan semua data user yang tersimpan di database
  static async findAll() {
    const result = await this.collection().find().toArray();
    return result;
  }

  // menampilkan data user sesuai id yang dicari
  static async findUserById(id) {
    const result = await this.collection().findOne({ _id: new ObjectId(id) });
    return result;
  }

  // menampilkan data user sesuai filter yang dicari
  static async findOne(filter) {
    const result = await this.collection().findOne(filter);
    return result;
  }

  // membuat data user atau untuk register
  static async createUser(newUser) {
    UserSchema.parse(newUser);

    const existingUser = await this.collection().findOne({
      $or: [{ username: newUser.username }, { email: newUser.email }],
    });

    if (existingUser) {
      if (existingUser.username === newUser.username) {
        throw new Error("Username already exists");
      }
      if (existingUser.email === newUser.email) {
        throw new Error("Email already exists");
      }
    }

    if (!newUser.image) {
      newUser.image =
        "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png";
    }

    newUser.password = await hashPassword(newUser.password);

    const result = await this.collection().insertOne(newUser);

    const { password, ...userWithoutPassword } = newUser;
    console.log(password);

    return {
      ...userWithoutPassword,
      _id: result.insertedId,
    };
  }

  static async editImageProfile(username, newImage) {
    if (!newImage) {
      throw new Error("Image URL is required");
    }

    const user = await this.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const result = await this.collection().updateOne(
      { username },
      {
        $set: {
          image: newImage,
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("Failed to update profile image");
    }

    return { message: "Profile image updated successfully", image: newImage };
  }
}
