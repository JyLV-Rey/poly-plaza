"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../supabase"
import { Link } from "react-router-dom"
import { Star, ShoppingCart, CreditCard } from "lucide-react"
import { useUser } from "../../UserContext"
import LoadingScreen from "./LoadingScreen"

function ProductList({ searchTerm, searchCategory, isDescending, sortBy, maxPrice, limit = 500, searchStore }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState({})
  const [messages, setMessages] = useState({})
  const [exploreProducts, setExploreProducts] = useState([])
  const { userId } = useUser()

  useEffect(() => {
    fetchItems()
  }, [searchTerm, searchCategory, isDescending, sortBy, maxPrice, searchStore])

  async function fetchItems() {
    setLoading(true)
    setError(null)

    let query = supabase.from("product").select(`
        product_id,
        name,
        category,
        price,
        product_image (
          image_url
        ),
        seller (
          seller_name
        ),
        review (
          rating
        ),
        order_item (
          quantity
        )
      `).eq("is_deleted", false);
    
    if (searchStore) {
      const { data: sellers, error: sellerError } = await supabase
        .from("seller")
        .select("seller_id")
        .ilike("seller_name", `%${searchStore}%`);

      if (sellerError) {
        setError(sellerError.message);
        return;
      }

      const matchingSellerIds = sellers.map(s => s.seller_id);
      if (matchingSellerIds.length > 0) {
        query = query.in("seller_id", matchingSellerIds);
      } else {
        // No matching sellers → return early with empty result
        setItems([]);
        setLoading(false);
        return;
      }
    }
    
    if (searchTerm) query = query.ilike("name", `%${searchTerm}%`)
    if (searchCategory) query = query.eq("category", searchCategory)
    if (maxPrice) {
      const numericMaxPrice = Number.parseFloat(maxPrice)
      if (!isNaN(numericMaxPrice)) query = query.lte("price", numericMaxPrice)
    }

    if (sortBy === "price") {
      query = query.order("price", { ascending: !isDescending })
    }

    query = query.limit(limit)

    const { data, error } = await query

    if (error) {
      setError(error.message)
      setItems([])
    } else {
      if (sortBy === "reviews") {
        data.sort((a, b) => {
          const avgA = getAverageRating(a.review)
          const avgB = getAverageRating(b.review)
          return isDescending ? avgB - avgA : avgA - avgB
        })
      } else if (sortBy === "orders") {
        data.sort((a, b) => {
          const totalA = getTotalOrders(a.order_item)
          const totalB = getTotalOrders(b.order_item)
          return isDescending ? totalB - totalA : totalA - totalB
        })
      }
      setItems(data)

      // If no results found, fetch explore products
      if (data.length === 0) {
        fetchExploreProducts()
      }
    }
    setLoading(false)
  }

  async function fetchExploreProducts() {
    const { data } = await supabase
      .from("product")
      .select(`
        product_id,
        name,
        category,
        price,
        product_image (image_url),
        seller (seller_name),
        review (rating),
        order_item (quantity)
      `)
      .limit(12)

    if (data) {
      setExploreProducts(data)
    }
  }

  function getAverageRating(reviews) {
    const ratings = reviews?.map((r) => r.rating) || []
    if (ratings.length === 0) return 0
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
  }

  function getTotalOrders(orderItems) {
    const quantities = orderItems?.map((o) => o.quantity) || []
    return quantities.reduce((a, b) => a + b, 0)
  }

  async function addToCart(productId) {
    if (!userId) {
      setMessages((prev) => ({ ...prev, [productId]: "Please login to add items to cart" }))
      setTimeout(() => setMessages((prev) => ({ ...prev, [productId]: "" })), 3000)
      return
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: true }))
    try {
      let { data: cart } = await supabase.from("cart").select("cart_id").eq("buyer_id", userId).single()

      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from("cart")
          .insert({ buyer_id: userId })
          .select("cart_id")
          .single()

        if (cartError) throw cartError
        cart = newCart
      }

      const { data: existingItem } = await supabase
        .from("cartitem")
        .select("cart_item_id, quantity")
        .eq("cart_id", cart.cart_id)
        .eq("product_id", productId)
        .single()

      if (existingItem) {
        const { error } = await supabase
          .from("cartitem")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("cart_item_id", existingItem.cart_item_id)

        if (error) throw error
        setMessages((prev) => ({ ...prev, [productId]: "Updated quantity in cart!" }))
      } else {
        const { error } = await supabase.from("cartitem").insert({
          cart_id: cart.cart_id,
          product_id: productId,
          quantity: 1,
        })

        if (error) throw error
        setMessages((prev) => ({ ...prev, [productId]: "Added to cart!" }))
      }

      setTimeout(() => setMessages((prev) => ({ ...prev, [productId]: "" })), 3000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setMessages((prev) => ({ ...prev, [productId]: "Error adding to cart" }))
      setTimeout(() => setMessages((prev) => ({ ...prev, [productId]: "" })), 3000)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  function renderProductCard(item) {
    return (
      <div
        key={item.product_id}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg/5 hover:shadow-xl hover:scale-105 ease-(--my-beizer) transition-all duration-300 overflow-hidden group"
      >
        <div className="p-4">
        {/* Product Image */}
        <Link to={`/product/view?productId=${item.product_id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              style={{ imageRendering: "pixelated" }}
              src={item.product_image?.[0]?.image_url || "/placeholder.svg?height=300&width=300"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        

        {/* Product Info */}
        
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {item.name}
            </h3>


          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{getAverageRating(item.review).toFixed(1)}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{getTotalOrders(item.order_item)} sold</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">₱{item.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{item.category}</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{item.seller?.seller_name}</span>
          </div>
          </Link>
          {/* Action Buttons */}
          <div className="flex flex-row flex-grow h-20 gap-5 items-center justify-between">
            <div className="flex justify-center flex-grow">
              <button
                onClick={() => addToCart(item.product_id)}
                disabled={addingToCart[item.product_id]}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {addingToCart[item.product_id] ? "Adding..." : "Add to Cart"}
                </span>
              </button>
            </div>
            <div className="flex justify-center flex-grow">
              <Link
                to={`/product/confirm_order?productId=${item.product_id}&quantity=1`}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-xl hover:bg-green-700 transition-colors duration-200"
              >
                <span className="text-sm font-medium">Buy Item</span>
                <CreditCard className="w-4 h-4" />
              </Link>
            </div>
          </div>


          {/* Message */}
          {messages[item.product_id] && (
            <p
              className={`text-xs mt-2 text-center ${messages[item.product_id].includes("Error") ? "text-red-500" : "text-green-500"}`}
            >
              {messages[item.product_id]}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <LoadingScreen />
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>

  // No results found
  if (items.length === 0) {
    return (
      <div className="space-y-8">
        {/* No Results Message */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        </div>

        {/* Explore Other Products */}
        {exploreProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {exploreProducts.map((item) => renderProductCard(item))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Results found
  return (
    <div className="flex flex-row items-center flex-wrap justify-between gap-5 h-auto rounded-xl m-10 p-2 border-2 border-neutral-300">
      {items.map((item) => renderProductCard(item))}
    </div>
  )
}

export default ProductList
