import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB as dbConnect } from "./lib/db";
export const runtime = "nodejs";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({


  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Authorize function called");
        await dbConnect();
        console.log("Database connected");

        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) {
          console.log("User not found");
          return null;
        }
        console.log("User found:", user);

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }
        console.log("Password is valid");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // "admin" or "superAdmin"
        };
      },
    }),
  ],

    callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
