import { NextResponse } from "next/server";
import { UserModel } from "@/models/UserModel";
import { handleError } from "@/helpers/handleError";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  console.log(query, "<< ini querynya");

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const users = await UserModel.findByUsername({
      username: { $regex: query, $options: "i" },
    });
    console.log(users);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    handleError(error);
    return NextResponse.json(
      { message: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
