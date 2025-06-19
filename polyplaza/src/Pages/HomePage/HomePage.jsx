"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, TrendingUp, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useUser } from "../UserContext"
import { supabase } from "../../supabase"
import ProductCard from "./components/ProductCard"
import { getCategories } from "../SearchPage/Components/query"

function HomePage() {
  const { userId, userFirstName } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const navigate = useNavigate()

  const [searchCategory, setSearchCategory] = useState("")
  const [sortBy, setSortBy] = useState("reviews")
  const [isDescending, setIsDescending] = useState("Descending")
  const [maxPrice, setMaxPrice] = useState("")

  // Category scroll state
  const categoryScrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchTrendingProducts()
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    checkScrollButtons()
  }, [categories])

  async function fetchCategories() {
    const data = await getCategories()
    setCategories(data)
  }

  async function fetchTrendingProducts() {
    const { data } = await supabase
      .from("product")
      .select(`
        product_id,
        name,
        price,
        category,
        product_image (image_url),
        seller (seller_name),
        review (rating),
        order_item (quantity)
      `)
      .limit(8)

    if (data) {
      // Sort by total orders (trending)
      const sorted = data.sort((a, b) => {
        const ordersA = a.order_item?.reduce((sum, item) => sum + item.quantity, 0) || 0
        const ordersB = b.order_item?.reduce((sum, item) => sum + item.quantity, 0) || 0
        return ordersB - ordersA
      })
      setTrendingProducts(sorted.slice(0, 4))
    }
  }

  async function fetchFeaturedProducts() {
    const { data } = await supabase
      .from("product")
      .select(`
        product_id,
        name,
        price,
        category,
        product_image (image_url),
        seller (seller_name),
        review (rating),
        order_item (quantity)
      `)
      .limit(12)

    if (data) {
      setFeaturedProducts(data)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    navigate(
      `/search?searchTerm=${searchTerm}&searchCategory=${searchCategory}&isDescending=${isDescending}&maxPrice=${maxPrice}&sortBy=${sortBy}`,
    )
  }

  function scrollCategories(direction) {
    const container = categoryScrollRef.current
    if (container) {
      const scrollAmount = 300
      const newScrollLeft =
        direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  function checkScrollButtons() {
    const container = categoryScrollRef.current
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0)
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Greeting */}
          {userId && (
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Hi, {userFirstName}! 👋</h1>
              <p className="text-blue-100 text-xl">Welcome back to PolyPlaza</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="w-full max-w-none mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-lg rounded-2xl border-0 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
            {/* Search Filters */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="reviews">Reviews</option>
                <option value="price">Price</option>
                <option value="orders">Orders</option>
              </select>

              <select
                value={isDescending}
                onChange={(e) => setIsDescending(e.target.value)}
                className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Descending">Highest to Lowest</option>
                <option value="Ascending">Lowest to Highest</option>
              </select>

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number.parseInt(e.target.value))}
                className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="relative flex items-center">
          {/* Left Arrow - Outside container */}
          {showLeftArrow && (
            <button
              onClick={() => scrollCategories("left")}
              className="absolute -left-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Categories Container */}
          <div
            ref={categoryScrollRef}
            onScroll={checkScrollButtons}
            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide mx-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/search?searchCategory=${category}`}
                className="flex-shrink-0 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 min-w-fit"
              >
                <span className="text-gray-700 font-medium whitespace-nowrap">{category}</span>
              </Link>
            ))}
          </div>

          {/* Right Arrow - Outside container */}
          {showRightArrow && (
            <button
              onClick={() => scrollCategories("right")}
              className="absolute -right-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <Link
            to="/search?sortBy=orders&isDescending=Descending"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>

      {/* View All Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
            <span>View All Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
