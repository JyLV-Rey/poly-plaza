"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Star, ShoppingCart, CreditCard } from "lucide-react"
import { useUser } from "../../UserContext"
import { supabase } from "../../../supabase"

function ProductCard({ product }) {
  const { userId } = useUser()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const navigate = useNavigate()

  // Calculate average rating
  const averageRating =
    product.review?.length > 0
      ? product.review.reduce((sum, review) => sum + review.rating, 0) / product.review.length
      : 0

  // Calculate total orders
  const totalOrders = product.order_item?.reduce((sum, item) => sum + item.quantity, 0) || 0

  async function handleAddToCart() {
    if (!userId) {
      navigate("/account/login")
      return
    }

    setIsAddingToCart(true)
    try {
      // Get or create cart for user
      let { data: cart } = await supabase.from("cart").select("cart_id").eq("buyer_id", userId).single()

      if (!cart) {
        const { data: newCart } = await supabase.from("cart").insert({ buyer_id: userId }).select("cart_id").single()
        cart = newCart
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cartitem")
        .select("cart_item_id, quantity")
        .eq("cart_id", cart.cart_id)
        .eq("product_id", product.product_id)
        .single()

      if (existingItem) {
        // Update quantity
        await supabase
          .from("cartitem")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("cart_item_id", existingItem.cart_item_id)
      } else {
        // Add new item
        await supabase.from("cartitem").insert({
          cart_id: cart.cart_id,
          product_id: product.product_id,
          quantity: 1,
        })
      }

      alert("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  function handleBuyNow() {
    if (!userId) {
      navigate("/account/login")
      return
    }
    navigate(`/product/confirm_order?productId=${product.product_id}&quantity=1`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <Link to={`/product/view?productId=${product.product_id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.product_image?.[0]?.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <Link to={`/product/view?productId=${product.product_id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Orders */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-600">{averageRating > 0 ? averageRating.toFixed(1) : "No reviews"}</span>
            <span className="text-gray-400">({product.review?.length || 0})</span>
          </div>
          <span className="text-gray-500">{totalOrders} sold</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-500">by {product.seller?.seller_name}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200"
          >
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
