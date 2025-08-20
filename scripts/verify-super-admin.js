
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/User.js";

async function verifySuperAdmin() {
  await connectDB();

  try {
    console.log("🔍 Searching for super admin...");
    const superAdmin = await User.findOne({ role: "superAdmin" });

    if (superAdmin) {
      console.log("✅ Success! Super admin found:");
      console.log({
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt,
      });
    } else {
      console.log("❌ No super admin user found in the database.");
    }
  } catch (error) {
    console.error("An error occurred while verifying the super admin:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
  }
}

verifySuperAdmin();
