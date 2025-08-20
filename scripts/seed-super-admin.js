import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { connectDB as dbConnect } from "../lib/db.js";
import User from "../models/User.js";

const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;

async function main() {
  if (!email || !password) {
    throw new Error("❌ Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in your .env file");
  }

  await dbConnect();

  // Check if superAdmin already exists
  const existing = await User.findOne({ role: "superAdmin" });
  if (existing) {
    console.log("⚠️ A superAdmin already exists:", existing.email);
    return; // Exit the function gracefully
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: "Super Admin",
    email: email.toLowerCase(),
    passwordHash,
    role: "superAdmin",
  });

  console.log("✅ Super Admin created:", user.email);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });