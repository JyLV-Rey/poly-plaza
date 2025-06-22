// ProductFilterBar.jsx
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../../../../supabase"

function ProductFilterBar() {
  const [sortBy, setSortBy] = useState("product_id")
  const [isDescending, setIsDescending] = useState("Descending")
  const [sellerFilter, setSellerFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [productName, setProductName] = useState("")
  const [categories, setCategories] = useState([])
  const [isDeletedFilter, setIsDeletedFilter] = useState("");

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Populate filters from URL
    const params = new URLSearchParams(location.search)
    setSortBy(params.get("sortBy") || "product_id")
    setIsDescending(params.get("isDescending") || "Descending")
    setSellerFilter(params.get("seller_name") || "")
    setCategoryFilter(params.get("category") || "")
    setProductName(params.get("product_name") || "")
    setIsDeletedFilter(params.get("is_deleted") || "")
  }, [location.search])

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("product").select("category").neq("category", null)
      if (!error) {
        const unique = [...new Set(data.map((row) => row.category))].sort()
        setCategories(unique)
      }
    }
    fetchCategories()
  }, [])

  function applyFilters() {
    const params = new URLSearchParams()
    if (sortBy) params.set("sortBy", sortBy)
    if (isDescending) params.set("isDescending", isDescending)
    if (sellerFilter) params.set("seller_name", sellerFilter)
    if (categoryFilter) params.set("category", categoryFilter)
    if (productName) params.set("product_name", productName)
    if (isDeletedFilter !== "") params.set("is_deleted", isDeletedFilter)

    navigate({ search: params.toString() })
  }

  return (
    <div className="flex flex-wrap gap-4 text-neutral-600">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-lg">
        <option value="product_id">Sort by ID</option>
        <option value="name">Sort by Name</option>
        <option value="category">Sort by Category</option>
        <option value="price">Sort by Price</option>
      </select>

      <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="border p-2 rounded-lg">
        <option value="Descending">Descending</option>
        <option value="Ascending">Ascending</option>
      </select>

      <input
        value={sellerFilter}
        onChange={(e) => setSellerFilter(e.target.value)}
        placeholder="Filter by Store Name"
        className="border p-2 rounded-lg"
      />

      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded-lg">
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={isDeletedFilter}
        onChange={(e) => setIsDeletedFilter(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">All Statuses</option>
        <option value="false">Active</option>
        <option value="true">Disabled</option>
      </select>
      
      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Search Product Name"
        className="border p-2 rounded-lg"
      />

      <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 hover:bg-blue-100 hover:text-blue-600 hover:font-bold text-white border-2 hover:border-blue-600 rounded-lg">
        Apply
      </button>
    </div>
  )
}

export default ProductFilterBar
