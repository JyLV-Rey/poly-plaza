"use client"

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
      // Get or create cart for user
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

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cartitem")
        .select("cart_item_id, quantity")
        .eq("cart_id", cart.cart_id)
        .eq("product_id", productId)
        .single()

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from("cartitem")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("cart_item_id", existingItem.cart_item_id)

        if (error) throw error
        setMessage("Updated quantity in cart!")
      } else {
        // Add new item to cart
        const { error } = await supabase.from("cartitem").insert({
          cart_id: cart.cart_id,
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
        <p className={`text-sm mt-1 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>
      )}
    </div>
  )
}

export default CartButton
