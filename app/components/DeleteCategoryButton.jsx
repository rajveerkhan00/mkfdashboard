"use client";

import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleDelete } from ".";

export function DeleteCategoryButton({ id, publicId }) {
  const router = useRouter();

  const handleDeletefun = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      await handleDelete(publicId);

      const res = await fetch(`https://custompackboxes.vercel.app/api/category/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted successfully.");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the category.");
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleDeletefun}
      className="text-red-600 cursor-pointer"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}

export function DeleteProductButton({ id, publicId }) {
  const router = useRouter();

  const handleDeletefun = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await handleDelete(publicId);

      const res = await fetch(`https://custompackboxes.vercel.app/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted successfully.");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the product.");
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleDeletefun}
      className="text-red-600 cursor-pointer"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}
