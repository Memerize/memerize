import { handleError } from "@/helpers/handleError";
import { comparePasswords, signToken } from "@/helpers/jwt-bcrypt";
import { UserModel } from "@/models/UserModel";
import { z } from "zod";
import { NextResponse } from "next/server";

const LoginSchema = z.object({
  emailOrUsername: z.string().nonempty("Email or Username is required"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

export async function POST(request) {
  try {
    const rawBody = await request.json();
    const body = LoginSchema.parse(rawBody);

    const user = await UserModel.findOne({
      $or: [
        { email: body.emailOrUsername },
        { username: body.emailOrUsername },
      ],
    });

    if (!user) {
      throw new Error("Invalid Email/Username or Password");
    }

    const isValidPassword = await comparePasswords(
      body.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid Email/Username or Password");
    }
    delete user.password;
    const access_token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      access_token,
      user,
    });

    response.cookies.set("Authorization", `Bearer ${access_token}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("User", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
