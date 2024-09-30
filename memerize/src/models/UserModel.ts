import { db } from "@/db/config";
import { hashPassword } from "@/helpers/jwt-bcrypt";
import { UserSchema, UserTypes } from "@/types";
import { Filter, ObjectId } from "mongodb";

export class UserModel {
  static collection() {
    return db.collection<UserTypes>("users");
  }

  // menampilkan semua data user yang tersimpan di database
  static async findAll() {
    const result = await this.collection().find().toArray();
    return result;
  }

  // menampilkan data user sesuai id yang dicari
  static async findUserById(id: string) {
    const result = await this.collection().findOne({ _id: new ObjectId(id) });
    return result;
  }

  // menampilkan data user sesuai filter yang dicari
  static async findOne(filter: Filter<UserTypes>) {
    const result = await this.collection().findOne(filter);
    return result;
  }

  // membuat data user atau untuk register
  static async createUser(newUser: UserTypes) {
    UserSchema.parse(newUser);

    const existingUser = await this.collection().findOne({
      $or: [{ username: newUser.username }, { email: newUser.email }],
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    if (!newUser.image) {
      newUser.image =
        "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png";
    }

    newUser.password = await hashPassword(newUser.password);

    const result = await this.collection().insertOne(newUser);

    const { password, ...userWithoutPassword } = newUser;

    return {
      ...userWithoutPassword,
      _id: result.insertedId,
    };
  }
}
