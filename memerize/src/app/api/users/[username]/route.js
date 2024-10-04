import { handleError } from "@/helpers/handleError";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";

export async function GET(request, { params }) {
  const { username } = params;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
