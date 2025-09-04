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
  secret: process.env.NEXTAUTH_SECRET,


  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

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
