import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db/config";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        let userData;
        let username = profile.email.split("@")[0];

        try {
          // Check if the user already exists by email
          const existingUser = await db
            .collection("users")
            .findOne({ email: profile.email }, { projection: { password: 0 } });

          // If the user doesn't exist, create a new user
          if (!existingUser) {
            // Check if the username already exists
            const existingUsername = await db
              .collection("users")
              .findOne({ username }, { projection: { password: 0 } });

            // If the username already exists, append timestamp to make it unique
            if (existingUsername) {
              // console.log("USERNAME EXISTED");
              username += Date.now();
            }

            userData = {
              name: profile.name,
              username: username,
              email: profile.email,
              image:
                profile.image ||
                "https://res.cloudinary.com/dlj1xpqqa/image/upload/v1728276780/k48t01fbihbdgzoa8qer.png",
            };

            // Insert the new user into the database
            await db.collection("users").insertOne(userData);
          } else {
            // console.log("User already exists");
            userData = existingUser;
          }
          // console.log(userData)
          token.name = userData.name;
          token.email = userData.email;
          token.username = userData.username;
          token.image =
            userData.image ||
            "https://res.cloudinary.com/dlj1xpqqa/image/upload/v1728276780/k48t01fbihbdgzoa8qer.png";
          token.accessToken = account.access_token;
          // console.log(token)
        } catch (error) {
          console.error("Error saving user to database:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
