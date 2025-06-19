"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { supabase } from "../../supabase"
import { useNavigate } from "react-router-dom"
import CheckCredentials from "../CheckCredentials"
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"

function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const { userId } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCartItems()
  }, [userId])

  async function fetchCartItems() {
    if (!userId) return

    try {
      const { data } = await supabase
        .from("cart")
        .select(`
          cart_id,
          cartitem (
            cart_item_id,
            quantity,
            product (
              product_id,
              name,
              price,
              description,
              product_image (
                image_url
              )
            )
          )
        `)
        .eq("buyer_id", userId)
        .single()

      setCartItems(data?.cartitem || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
      await removeItem(cartItemId)
      return
    }

    try {
      // Update the local state immediately to prevent reordering
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item)),
      )

      const { error } = await supabase.from("cartitem").update({ quantity: newQuantity }).eq("cart_item_id", cartItemId)

      if (error) {
        // If error, revert the change
        fetchCartItems()
        throw error
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  async function removeItem(cartItemId) {
    try {
      const { error } = await supabase.from("cartitem").delete().eq("cart_item_id", cartItemId)

      if (error) throw error
      fetchCartItems()
      setSelectedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  function toggleItemSelection(cartItemId) {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cartItemId)) {
        newSet.delete(cartItemId)
      } else {
        newSet.add(cartItemId)
      }
      return newSet
    })
  }

  function selectAllItems() {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.cart_item_id)))
    }
  }

  function buySelectedItems() {
    if (selectedItems.size === 0) {
      alert("Please select items to purchase")
      return
    }

    const selectedCartItemIds = Array.from(selectedItems)
    const cartItemIdsParam = selectedCartItemIds.join(",")
    navigate(`/product/confirm_order?cartItems=${cartItemIdsParam}`)
  }

  const selectedItemsData = cartItems.filter((item) => selectedItems.has(item.cart_item_id))
  const selectedTotal = selectedItemsData.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  if (loading) {
    return (
      <CheckCredentials>
        <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  return (
    <CheckCredentials>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Discover amazing products and add them to your cart</p>
                <button
                  onClick={() => navigate("/search")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Select All Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={selectAllItems}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-900">
                      Select All ({selectedItems.size}/{cartItems.length})
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Cart Total: ₱{totalPrice.toFixed(2)}</p>
                    {selectedItems.size > 0 && (
                      <p className="text-lg font-bold text-blue-600">Selected: ₱{selectedTotal.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className={`p-6 transition-colors duration-200 ${
                      selectedItems.has(item.cart_item_id) ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.cart_item_id)}
                        onChange={() => toggleItemSelection(item.cart_item_id)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />

                      <div className="flex-shrink-0 w-20 h-20">
                        {item.product.product_image?.[0] && (
                          <img
                            src={item.product.product_image[0].image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                        <p className="text-xl font-bold text-blue-600 mt-2">₱{item.product.price}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.cart_item_id)}
                          className="mt-2 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate("/search")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>

                  <div className="flex items-center space-x-6">
                    {selectedItems.size > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Selected Items</p>
                        <p className="text-2xl font-bold text-blue-600">₱{selectedTotal.toFixed(2)}</p>
                      </div>
                    )}
                    <button
                      onClick={buySelectedItems}
                      disabled={selectedItems.size === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
                    >
                      Buy Now ({selectedItems.size} items)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CheckCredentials>
  )
}

export default CartPage
