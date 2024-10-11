import { handleError } from "@/helpers/handleError";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await UserModel.findAll();

    return new NextResponse(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
}
