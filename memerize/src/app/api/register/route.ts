import { handleError } from "@/helpers/handleError";
import { UserModel } from "@/models/UserModel";
import { UserTypes } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UserTypes;

    await UserModel.createUser(body);

    return Response.json({ message: "Register success" });
  } catch (error) {
    return handleError(error);
  }
}
