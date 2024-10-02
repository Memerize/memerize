import { handleError } from "@/helpers/handleError";
import { UserModel } from "@/models/UserModel";

export async function POST(request) {
  try {
    const body = await request.json();
    body.username = body.username.trim();

    await UserModel.createUser(body);

    return Response.json({ message: "Register success" });
  } catch (error) {
    return handleError(error);
  }
}
