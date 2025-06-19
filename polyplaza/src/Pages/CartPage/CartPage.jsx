import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { supabase } from "../../supabase"
import { useNavigate } from "react-router-dom"
import CheckCredentials from "../CheckCredentials"

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
      const { error } = await supabase.from("cartitem").update({ quantity: newQuantity }).eq("cart_item_id", cartItemId)

      if (error) throw error
      fetchCartItems()
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  async function removeItem(cartItemId) {
    try {
      const { error } = await supabase.from("cartitem").delete().eq("cart_item_id", cartItemId)

      if (error) throw error
      fetchCartItems()
      // Remove from selected items if it was selected
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

    // Convert selected items to cart item IDs
    const selectedCartItemIds = Array.from(selectedItems)
    const cartItemIdsParam = selectedCartItemIds.join(",")

    // Navigate to confirm order page with cart items
    navigate(`/product/confirm_order?cartItems=${cartItemIdsParam}`)
  }

  const selectedItemsData = cartItems.filter((item) => selectedItems.has(item.cart_item_id))
  const selectedTotal = selectedItemsData.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  if (loading) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl">Loading cart...</p>
        </div>
      </CheckCredentials>
    )
  }

  return (
    <CheckCredentials>
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4 text-black">Your cart is empty</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-black">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Select All Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                    onChange={selectAllItems}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-semibold">
                    Select All ({selectedItems.size}/{cartItems.length})
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Cart Total: ₱{totalPrice.toFixed(2)}</p>
                  {selectedItems.size > 0 && (
                    <p className="text-lg font-bold text-green-600">Selected: ₱{selectedTotal.toFixed(2)}</p>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className={`flex items-center border-b border-gray-200 py-4 last:border-b-0 ${
                    selectedItems.has(item.cart_item_id) ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.cart_item_id)}
                    onChange={() => toggleItemSelection(item.cart_item_id)}
                    className="mr-4 w-4 h-4"
                  />

                  <div className="flex-shrink-0 w-20 h-20">
                    {item.product.product_image?.[0] && (
                      <img
                        src={item.product.product_image[0].image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex-grow ml-4">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">{item.product.description}</p>
                    <p className="text-lg font-bold text-green-600">₱{item.product.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="ml-4 text-right">
                    <p className="text-lg font-bold">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate("/search")}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Continue Shopping
                  </button>

                  <div className="flex items-center space-x-4">
                    {selectedItems.size > 0 && (
                      <span className="text-xl font-bold">Selected Total: ₱{selectedTotal.toFixed(2)}</span>
                    )}
                    <button
                      onClick={buySelectedItems}
                      disabled={selectedItems.size === 0}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy Now ({selectedItems.size} items)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CheckCredentials>
  )
}

export default CartPage
