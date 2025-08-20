"use client"

import { Trash2 } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DeleteCategoryButton({ id }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this category?")
    if (!confirmed) return

    try {
      const res = await fetch(`https://custompackboxes.vercel.app/api/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        toast.success("Category deleted successfully.")
        router.refresh() // Refresh the page (only works inside `app` dir)
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to delete category.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred.")
    }
  }

  return (
    <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  )
}


export  function DeleteProductButton({ id }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this category?")
    if (!confirmed) return

    try {
      const res = await fetch(`https://custompackboxes.vercel.app/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        toast.success("Category deleted successfully.")
        router.refresh() // Refresh the page (only works inside `app` dir)
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to delete category.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred.")
    }
  }

  return (
    <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  )
}
