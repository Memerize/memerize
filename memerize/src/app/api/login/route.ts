import { handleError } from "@/helpers/handleError";
import { comparePasswords, signToken } from "@/helpers/jwt-bcrypt";
import { UserModel } from "@/models/UserModel";
import { UserSchema } from "@/types";

const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const body = LoginSchema.parse(rawBody);

    const user = await UserModel.findOne({
      email: body.email,
    });
    if (!user) {
      throw new Error("Invalid Email/Password");
    }

    const isValidPassword = await comparePasswords(
      body.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid Email/Password");
    }

    const { password, ...safeUser } = user;
    console.log(password);
    
    const access_token = signToken(safeUser);

    return Response.json({
      access_token,
      user: safeUser,
    });
  } catch (error) {
    return handleError(error);
  }
}
