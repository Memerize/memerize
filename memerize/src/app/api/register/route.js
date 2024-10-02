import { handleError } from "@/helpers/handleError";
import { UserModel } from "@/models/UserModel";
import { UserSchema } from "@/types";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedBody = UserSchema.parse(body);

    parsedBody.username = parsedBody.username.trim();

    await UserModel.createUser(parsedBody);

    return new Response(JSON.stringify({ message: "Register success" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
}
