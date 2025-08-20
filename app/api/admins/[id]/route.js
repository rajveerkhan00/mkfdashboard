import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { password } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: 'New password is required.' }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { passwordHash: passwordHash },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Admin password updated successfully.' }, { status: 200 });

  } catch (error) {
    console.error("Error updating admin password:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    // Prevent deletion of the superAdmin
    const userToDelete = await User.findById(id);
    if (userToDelete && userToDelete.role === 'superAdmin') {
        return NextResponse.json({ message: 'Cannot delete the super admin.' }, { status: 403 }); // 403 Forbidden
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Admin deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
