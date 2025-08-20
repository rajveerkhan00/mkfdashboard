import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Find all users with the role 'admin', excluding the superAdmin
    const admins = await User.find({ role: 'admin' }).select('-passwordHash'); // Exclude password hash from the result

    return NextResponse.json(admins, { status: 200 });

  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
