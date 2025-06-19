"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useUser } from "../UserContext"
import { supabase } from "../../supabase"
import CheckCredentials from "../CheckCredentials"
import AddressBook from "../../GlobalFeatures/AddressBook"

function ConfirmOrderPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userId } = useUser()

  // Check if this is a single product purchase or cart items purchase
  const productId = searchParams.get("productId")
  const quantity = searchParams.get("quantity")
  const cartItemIds = searchParams.get("cartItems")

  const [orderItems, setOrderItems] = useState([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [courierService, setCourierService] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const courierOptions = [
    "J&T Express",
    "GoGo Xpress",
    "Entrego",
    "2GO Express",
    "JRS Express",
    "Ninja Van",
    "LBC Express",
  ]

  const paymentOptions = ["UPI", "Card", "Wallet"]

  useEffect(() => {
    console.log("ConfirmOrderPage - URL params:", { productId, quantity, cartItemIds })

    if (productId && quantity) {
      console.log("Fetching single product")
      fetchSingleProduct()
    } else if (cartItemIds) {
      console.log("Fetching cart items")
      fetchCartItems()
    } else {
      console.log("No valid parameters found")
      setError("Invalid order parameters")
      setLoading(false)
    }
    fetchAddresses()
  }, [productId, quantity, cartItemIds, userId])

  async function fetchSingleProduct() {
    try {
      console.log("Fetching product with ID:", productId)
      const { data, error } = await supabase
        .from("product")
        .select(`
          product_id,
          name,
          price,
          description,
          product_image (image_url),
          seller (
            seller_id,
            seller_name,
            address (
              street,
              city,
              postal_code
            )
          )
        `)
        .eq("product_id", Number(productId))
        .single()

      if (error) {
        console.error("Error fetching product:", error)
        setError("Failed to fetch product details")
        return
      }

      console.log("Product data:", data)
      setOrderItems([
        {
          product: data,
          quantity: Number(quantity),
          cart_item_id: null,
        },
      ])
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to fetch product details")
    } finally {
      setLoading(false)
    }
  }

  async function fetchCartItems() {
    try {
      const cartItemIdArray = cartItemIds.split(",").map((id) => Number(id))
      console.log("Fetching cart items with IDs:", cartItemIdArray)

      const { data, error } = await supabase
        .from("cartitem")
        .select(`
          cart_item_id,
          quantity,
          product (
            product_id,
            name,
            price,
            description,
            product_image (image_url),
            seller (
              seller_id,
              seller_name,
              address (
                street,
                city,
                postal_code
              )
            )
          )
        `)
        .in("cart_item_id", cartItemIdArray)

      if (error) {
        console.error("Error fetching cart items:", error)
        setError("Failed to fetch cart items")
        return
      }

      console.log("Cart items data:", data)
      setOrderItems(data || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
      setError("Failed to fetch cart items")
    } finally {
      setLoading(false)
    }
  }

  async function fetchAddresses() {
    try {
      const { data } = await supabase
        .from("address")
        .select("address_id, street, city, postal_code")
        .eq("buyer_id", userId)

      setAddresses(data || [])
    } catch (error) {
      console.error("Error fetching addresses:", error)
    }
  }

  async function confirmOrder() {
    if (!selectedAddressIndex && selectedAddressIndex !== 0) {
      alert("Please select a delivery address")
      return
    }
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }
    if (!courierService) {
      alert("Please select a courier service")
      return
    }

    setLoading(true)
    try {
      console.log("Creating order for user:", userId)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("order")
        .insert({
          buyer_id: userId,
          status: "Pending",
        })
        .select("order_id")
        .single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        throw orderError
      }
      console.log("Order created:", order)

      // Create order items for all products
      const orderItemsData = orderItems.map((item) => ({
        order_id: order.order_id,
        product_id: item.product.product_id,
        quantity: item.quantity,
      }))

      const { error: orderItemError } = await supabase.from("order_item").insert(orderItemsData)

      if (orderItemError) {
        console.error("Order item creation error:", orderItemError)
        throw orderItemError
      }
      console.log("Order items created")

      // Create payment
      const { error: paymentError } = await supabase.from("payment").insert({
        order_id: order.order_id,
        payment_method: paymentMethod,
        payment_status: "Success",
      })

      if (paymentError) {
        console.error("Payment creation error:", paymentError)
        throw paymentError
      }
      console.log("Payment created")

      // Create delivery
      const selectedAddress = addresses[selectedAddressIndex]
      console.log("Selected address:", selectedAddress)

      const { error: deliveryError } = await supabase.from("delivery").insert({
        order_id: order.order_id,
        delivery_status: "Preparing",
        courier_service: courierService,
        buyer_address_id: selectedAddress.address_id,
      })

      if (deliveryError) {
        console.error("Delivery creation error:", deliveryError)
        throw deliveryError
      }
      console.log("Delivery created")

      // Remove items from cart if this was a cart purchase
      if (cartItemIds) {
        const cartItemIdArray = cartItemIds.split(",").map((id) => Number(id))
        const { error: removeCartError } = await supabase.from("cartitem").delete().in("cart_item_id", cartItemIdArray)

        if (removeCartError) {
          console.error("Error removing cart items:", removeCartError)
          // Don't throw error here, order was successful
        } else {
          console.log("Cart items removed")
        }
      }

      // Redirect to receipt
      navigate(`/product/view_receipt?orderId=${order.order_id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert(`Error creating order: ${error.message}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl">Loading order details...</p>
        </div>
      </CheckCredentials>
    )
  }

  if (error) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-2xl text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Search
            </button>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  if (orderItems.length === 0) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-4">No items found for this order</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Search
            </button>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  const totalPrice = orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const uniqueSellers = [...new Set(orderItems.map((item) => item.product.seller.seller_id))]

  return (
    <CheckCredentials>
      <div className="container mx-auto px-4 py-8 mt-16 text-black">
        <h1 className="text-4xl font-bold text-center mb-8">Confirm Your Order</h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Order Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Details ({orderItems.length} items)</h2>
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4 mb-4 last:border-b-0 last:mb-0">
                {item.product.product_image?.[0] && (
                  <img
                    src={item.product.product_image[0].image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">{item.product.description}</p>
                  <p className="text-sm text-gray-500">Seller: {item.product.seller.seller_name}</p>
                  <p className="text-lg font-bold text-green-600">
                    ₱{item.product.price} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="text-right pt-4 border-t">
              <p className="text-2xl font-bold">Total: ₱{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Seller Information ({uniqueSellers.length} seller{uniqueSellers.length > 1 ? "s" : ""})
            </h2>
            {uniqueSellers.map((sellerId) => {
              const sellerItem = orderItems.find((item) => item.product.seller.seller_id === sellerId)
              const seller = sellerItem.product.seller
              return (
                <div key={sellerId} className="bg-gray-50 p-4 rounded mb-2 last:mb-0">
                  <p className="font-semibold">{seller.seller_name}</p>
                  {seller.address && (
                    <p className="text-gray-600">
                      {seller.address.street}, {seller.address.city}
                      {seller.address.postal_code && `, ${seller.address.postal_code}`}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Address Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
            <AddressBook setFunction={setSelectedAddressIndex} />
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-4">
              {paymentOptions.map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 border-2 rounded-lg font-semibold ${
                    paymentMethod === method
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Courier Service */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Courier Service</h2>
            <select
              value={courierService}
              onChange={(e) => setCourierService(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
            >
              <option value="">Select a courier service</option>
              {courierOptions.map((courier) => (
                <option key={courier} value={courier}>
                  {courier}
                </option>
              ))}
            </select>
          </div>

          {/* Confirm Button */}
          <div className="text-center">
            <button
              onClick={confirmOrder}
              disabled={loading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl disabled:opacity-50"
            >
              {loading ? "Processing..." : `Confirm Order - ₱${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </CheckCredentials>
  )
}

export default ConfirmOrderPage
