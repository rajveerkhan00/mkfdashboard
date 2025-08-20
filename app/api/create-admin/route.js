import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the new admin user
    const newUser = await User.create({
      name: 'Admin User', // You can decide on a default name or modify the form to include it
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin', // Explicitly set the role to admin
    });

    return NextResponse.json({ message: 'Admin created successfully', userId: newUser._id }, { status: 201 });

  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
