import { useState } from "react"
import { useUser } from "../../UserContext"
import { supabase } from "../../../supabase"

function CartButton({ productId, quantity }) {
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState("")
  const { userId } = useUser()


  async function addToCart() {
  if (!userId) {
    setMessage("Please login to add items to cart")
    return
  }

  setIsAdding(true)
  try {
    // ✅ Step 1: Check if buyer is deleted
    const { data: buyerData, error: buyerError } = await supabase
      .from("buyer")
      .select("is_deleted")
      .eq("buyer_id", userId)
      .single()

    if (buyerError) throw buyerError
    if (buyerData?.is_deleted) {
      setMessage("Account is deleted. Cannot add to cart.")
      setTimeout(() => setMessage(""), 5000)
      return
    }

    // ✅ Step 2: Check current product stock
    const { data: productData, error: productError } = await supabase
      .from("product")
      .select("quantity")
      .eq("product_id", productId)
      .single()

    if (productError) throw productError

    if (!productData.quantity || productData.quantity <= 0) {
      setMessage("Product is out of stock")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // ✅ Step 3: Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from("cartitem")
      .select("cart_item_id, quantity")
      .eq("buyer_id", userId)
      .eq("product_id", productId)
      .single()

    const newTotalQuantity = existingItem ? existingItem.quantity + quantity : quantity

    // ✅ Step 4: Check stock limit
    if (newTotalQuantity > productData.quantity) {
      const availableToAdd = productData.quantity - (existingItem?.quantity || 0)
      if (availableToAdd <= 0) {
        setMessage("Cannot add more items - already at maximum available quantity in cart")
      } else {
        setMessage(
          `Can only add ${availableToAdd} more items (${productData.quantity} available, ${existingItem?.quantity || 0} already in cart)`
        )
      }
      setTimeout(() => setMessage(""), 5000)
      return
    }

    // ✅ Step 5: Insert or Update cart
    if (existingItem) {
      const { error } = await supabase
        .from("cartitem")
        .update({ quantity: newTotalQuantity })
        .eq("cart_item_id", existingItem.cart_item_id)

      if (error) throw error
      setMessage(`Updated quantity in cart! (${newTotalQuantity} total)`)
    } else {
      const { error } = await supabase.from("cartitem").insert({
        buyer_id: userId,
        product_id: productId,
        quantity: quantity,
      })

      if (error) throw error
      setMessage("Added to cart!")
    }

    setTimeout(() => setMessage(""), 3000)
  } catch (error) {
    console.error("Error adding to cart:", error)
    setMessage("Error adding to cart")
    setTimeout(() => setMessage(""), 3000)
  } finally {
    setIsAdding(false)
  }
}

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={addToCart}
        disabled={isAdding}
        className="bg-blue-500 hover:bg-blue-100 hover:scale-110 duration-200 ease-(--my-beizer) hover:text-blue-700 hover:border-2 border-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {message && (
        <p
          className={`text-sm mt-1 text-center max-w-xs ${message.includes("Error") || message.includes("Cannot") || message.includes("Can only") ? "text-red-500" : "text-green-500"}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export default CartButton
