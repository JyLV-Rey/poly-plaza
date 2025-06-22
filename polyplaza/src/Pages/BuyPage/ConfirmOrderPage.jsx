"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useUser } from "../UserContext"
import { supabase } from "../../supabase"
import CheckCredentials from "../CheckCredentials"
import AddressBook from "../../GlobalFeatures/AddressBook"
import { ShoppingBag, MapPin, CreditCard, Truck, CheckCircle, Store } from "lucide-react"

function ConfirmOrderPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userId } = useUser()

  const productId = searchParams.get("productId")
  const quantity = searchParams.get("quantity")
  const cartItemIds = searchParams.get("cartItems")

  const [orderItems, setOrderItems] = useState([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [courierService, setCourierService] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addressString, setAddressString] = useState("n/a")

  const courierOptions = [
    "J&T Express",
    "GoGo Xpress",
    "Entrego",
    "2GO Express",
    "JRS Express",
    "Ninja Van",
    "LBC Express",
  ]

  const paymentOptions = [
    { id: "COD", name: "COD", icon: "👛" },
    { id: "Card", name: "Credit/Debit Card", icon: "💳" },
    { id: "Wallet", name: "Digital Wallet", icon: "📱" },
  ]

  useEffect(() => {
    if (productId && quantity) {
      fetchSingleProduct()
    } else if (cartItemIds) {
      fetchCartItems()
    } else {
      setError("Invalid order parameters")
      setLoading(false)
    }
  }, [productId, quantity, cartItemIds, userId])

  async function fetchSingleProduct() {
    try {
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
        setError("Failed to fetch product details")
        return
      }

      setOrderItems([
        {
          product: data,
          quantity: Number(quantity),
          cart_item_id: null,
        },
      ])
    } catch (error) {
      setError("Failed to fetch product details: ", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCartItems() {
    try {
      const cartItemIdArray = cartItemIds.split(",").map((id) => Number(id))

      const { data, error } = await supabase
        .from("cartitem")
        .select(`
          cart_item_id,
          quantity,
          product:product_id (
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
        setError("Failed to fetch cart items")
        return
      }

      // Each entry has same shape as single product
      const transformed = data.map(item => ({
        product: item.product,
        quantity: item.quantity,
        cart_item_id: item.cart_item_id,
      }))

      setOrderItems(transformed)
    } catch (error) {
      console.error("Failed to fetch cart items:", error)
      setError("Failed to fetch cart items")
    } finally {
      setLoading(false)
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
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert({
        buyer_id: userId,
        status: "Pending",
      })
      .select("order_id")
      .single()

    if (orderError) throw orderError

    const orderItemsData = orderItems.map((item) => ({
      order_id: order.order_id,
      product_id: item.product.product_id,
      quantity: item.quantity,
    }))

    const { error: orderItemError } = await supabase.from("order_item").insert(orderItemsData)
    if (orderItemError) throw orderItemError

    for (const item of orderItems) {
      const { error: quantityError } = await supabase.rpc("decrease_quantity", {
        pid: item.product.product_id,
        qty: item.quantity,
      })
      if (quantityError) throw quantityError
    }

    // ✨ Set payment status based on method
const payment_status = paymentMethod === "COD" ? "Pending" : "Success"

  // Insert payment record
  const { data: paymentData, error: paymentError } = await supabase
    .from("payment")
    .insert({
      order_id: order.order_id,
      payment_method: paymentMethod,
      payment_status,
    })
    .select("payment_id")
    .single()

  if (paymentError) throw paymentError

  // If pending, nullify the paid_at timestamp
    if (payment_status === "Pending") {
      const { error: nullifyError } = await supabase
        .from("payment")
        .update({ paid_at: null })
        .eq("payment_id", paymentData.payment_id)

      if (nullifyError) throw nullifyError
    }

    const { error: deliveryError } = await supabase.from("delivery").insert({
      order_id: order.order_id,
      delivery_status: "Preparing",
      courier_service: courierService,
      buyer_address_id: selectedAddressIndex,
    })
    if (deliveryError) throw deliveryError

    if (cartItemIds) {
      const cartItemIdArray = cartItemIds.split(",").map((id) => Number(id))
      await supabase.from("cartitem").delete().in("cart_item_id", cartItemIdArray)
    }

    navigate(`/product/view_receipt?orderId=${order.order_id}&justOrdered=true`)
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
        <div className="min-h-screen bg-neutral-50 pt-20 flex justify-center items-center">
          <div className="bg-white rounded-3xl shadow-sm p-8 ">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-48 mb-4 "></div>
              <div className="h-4 bg-neutral-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  if (error) {
    return (
      <CheckCredentials>
        <div className="min-h-screen bg-neutral-50 pt-20 flex justify-center items-center ">
          <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error</h3>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
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
        <div className="min-h-screen bg-neutral-50 pt-20 flex justify-center items-center">
          <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Items Found</h3>
            <p className="text-neutral-600 mb-6">No items found for this order</p>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
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
      <div className="min-h-screen min-w-screen">
        <div className="p-20 bg-neutral-50 pt-20 text-black">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-4xl font-bold text-neutral-900">Confirm Your Order</h1>
              </div>
              <p className="text-neutral-600">Review your order details and complete your purchase</p>
            </div>

            <div className="space-y-6">
              {/* Order Details */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center mb-6">
                  <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">Order Details ({orderItems.length} items)</h2>
                </div>

                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-neutral-50 rounded-2xl">
                      {item.product.product_image?.[0] && (
                        <img
                          src={item.product.product_image[0].image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl mr-4"
                        />
                      )}
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-neutral-900">{item.product.name}</h3>
                        <p className="text-neutral-600">{item.product.description}</p>
                        <p className="text-sm text-neutral-500">Seller: {item.product.seller.seller_name}</p>
                        <p className="text-lg font-bold text-blue-600">
                          ₱{item.product.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-neutral-900">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right pt-6 border-t border-neutral-200 mt-6">
                  <p className="text-3xl font-bold text-blue-600">Total: ₱{totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center mb-6">
                  <Store className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Seller Information ({uniqueSellers.length} seller{uniqueSellers.length > 1 ? "s" : ""})
                  </h2>
                </div>

                <div className="space-y-3">
                  {uniqueSellers.map((sellerId) => {
                    const sellerItem = orderItems.find((item) => item.product.seller.seller_id === sellerId)
                    const seller = sellerItem.product.seller
                    return (
                      <div key={sellerId} className="bg-neutral-50 p-4 rounded-2xl">
                        <p className="font-semibold text-neutral-900">{seller.seller_name}</p>
                        {seller.address && (
                          <p className="text-neutral-600">
                            {seller.address.street}, {seller.address.city}
                            {seller.address.postal_code && `, ${seller.address.postal_code}`}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Address Selection */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">Delivery Address</h2>
                </div>
                <h2 className="text-lg font-medium text-neutral-500 italic">{addressString}</h2>
                <AddressBook setFunction={setSelectedAddressIndex} returnAddress={setAddressString}/>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentOptions.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-6 border-2 rounded-2xl font-semibold transition-all duration-200 ${
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-neutral-300 hover:border-blue-300 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div>{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Service */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">Courier Service</h2>
                </div>

                <select
                  value={courierService}
                  onChange={(e) => setCourierService(e.target.value)}
                  className="w-full p-4 border-2 border-neutral-300 rounded-2xl focus:border-blue-500 focus:outline-none text-lg"
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
              <div className="text-center pt-6">
                <button
                  onClick={confirmOrder}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-2xl text-xl transition-colors duration-200"
                >
                  {loading ? "Processing..." : `Confirm Order - ₱${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </CheckCredentials>
  )
}

export default ConfirmOrderPage
