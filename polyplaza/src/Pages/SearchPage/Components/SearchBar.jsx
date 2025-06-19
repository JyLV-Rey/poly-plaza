"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Search, SlidersHorizontal } from "lucide-react"
import { getCategories } from "./query"

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCategory, setSearchCategory] = useState("")
  const [sortBy, setSortBy] = useState("reviews")
  const [isDescending, setIsDescending] = useState("Descending")
  const [maxPrice, setMaxPrice] = useState("")
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories()
      setCategories(data)
    }
    fetchCategories()

    // Get search params from URL
    const urlParams = new URLSearchParams(location.search)
    setSearchTerm(urlParams.get("searchTerm") || "")
    setSearchCategory(urlParams.get("searchCategory") || "")
    setSortBy(urlParams.get("sortBy") || "reviews")
    setIsDescending(urlParams.get("isDescending") || "Descending")
    setMaxPrice(urlParams.get("maxPrice") || "")
  }, [location.search])

  function handleSearch(e) {
    e.preventDefault()
    navigate(
      `/search?searchTerm=${searchTerm}&searchCategory=${searchCategory}&isDescending=${isDescending}&maxPrice=${maxPrice}&sortBy=${sortBy}`,
    )
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 fixed top-20 left-0 right-0 z-40 w-full">
      <div className="w-full px-6 py-4">
        <form onSubmit={handleSearch} className="space-y-4 w-full">
          {/* Main Search Bar */}
          <div className="flex items-center space-x-4 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filters</span>
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="reviews">Reviews</option>
                  <option value="price">Price</option>
                  <option value="orders">Orders</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={isDescending}
                  onChange={(e) => setIsDescending(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Descending">Highest to Lowest</option>
                  <option value="Ascending">Lowest to Highest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Enter max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SearchBar
