'use client'

import { useForm } from 'react-hook-form';
import { useState, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Edit Admin Modal Component
function EditAdminModal({ admin, onClose, onUpdated }) {
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admins/${admin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        toast.success("Admin password updated successfully!");
        onUpdated();
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Admin: {admin.email}</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        toast.error('Failed to fetch admins.');
      }
    } catch (err) {
      toast.error('An error occurred while fetching admins.');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || session.user.role !== 'superAdmin') {
    router.push('/dashboard');
    return null;
  }

  const onSubmit = async (data) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/create-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Admin created successfully!');
          reset();
          fetchAdmins();
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to create admin');
          toast.error(errorData.message || 'Failed to create admin');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      }
    });
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const response = await fetch(`/api/admins/${adminId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success("Admin deleted successfully!");
        fetchAdmins();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete admin.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while deleting the admin.");
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold">Create New Admin</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Existing Admins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div key={admin._id} className="p-4 border rounded-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="font-semibold">{admin.email}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(admin)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(admin._id)}>Delete</Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No admin users found.</p>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={fetchAdmins}
        />
      )}
    </>
  );
}