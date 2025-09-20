
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function CategoryFilter({ categories }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || ''

  const handleChange = (e) => {
    const category = e.target.value
    if (category) {
      router.push(`/products?category=${category}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div>Filter:</div>
      <select
        name="catSelect"
        id="cat-select"
        className="border p-2"
        value={selectedCategory}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}
