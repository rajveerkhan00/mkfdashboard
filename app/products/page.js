import Link from "next/link"
import { DashboardShell, CustomList, CategoryFilter } from "../components"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function ProductPage({ searchParams }) {
  const categorySlug = searchParams.category || ''

  // 1. Fetch all categories and all products
  const [categoriesRes, allProductsRes] = await Promise.all([
    fetch(`https://custompackboxes.com/api/category`, {
      cache: "no-store",
      next: { revalidate: 0 },
    }),
    fetch(`https://custompackboxes.com/api/products`, { // Always fetch all products
      cache: "no-store",
      next: { revalidate: 0 },
    }),
  ]);

  const categories = await categoriesRes.json()
  const allProducts = await allProductsRes.json()

  // 2. Filter products on the server
  const filteredProducts = categorySlug
    ? allProducts.filter(product => product.categorySlug === categorySlug)
    : allProducts;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Products</h2>
          <p className="text-sm">Manage your packaging product</p>
        </div>
        <div className="flex items-center gap-3">
          <CategoryFilter categories={categories} />
        </div>
        <div>
          <Button asChild>
            <Link href="/products/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {/* 3. Pass the filtered list to CustomList */}
        <CustomList items={filteredProducts} isCategory={false} />
      </div>
    </DashboardShell>
  )
}
