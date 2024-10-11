import { handleError } from "@/helpers/handleError";
import { UserModel } from "@/models/UserModel";
import { UserSchema } from "@/types";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedBody = UserSchema.parse(body);

    parsedBody.username = parsedBody.username.trim();

    // Cek apakah username sudah ada
    const existingUserByUsername = await UserModel.findOne({
      username: parsedBody.username,
    });

    if (existingUserByUsername) {
      return new Response(JSON.stringify({ message: "Username already used" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cek apakah email sudah ada
    const existingUserByEmail = await UserModel.findOne({
      email: parsedBody.email,
    });

    if (existingUserByEmail) {
      return new Response(JSON.stringify({ message: "Email already used" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    await UserModel.createUser(parsedBody);

    return new Response(JSON.stringify({ message: "Register success" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
}
