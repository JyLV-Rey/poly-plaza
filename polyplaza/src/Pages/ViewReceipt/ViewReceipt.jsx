"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "../../supabase"
import CheckCredentials from "../CheckCredentials"

function ViewReceipt() {
  const [searchParams] = useSearchParams()
  const orderId = Number(searchParams.get("orderId"))
  const [orderData, setOrderData] = useState(null)
  const [deliveryData, setDeliveryData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderData()
  }, [orderId])

  async function fetchOrderData() {
    try {
      // Fetch order with basic info
      const { data: orderInfo } = await supabase
        .from("order")
        .select(`
          order_id,
          status,
          ordered_at,
          buyer (
            first_name,
            last_name,
            email
          ),
          order_item (
            quantity,
            product (
              product_id,
              name,
              price,
              description,
              product_image (
                image_url
              ),
              seller (
                seller_name,
                address (
                  street,
                  city,
                  postal_code
                )
              )
            )
          )
        `)
        .eq("order_id", orderId)
        .single()

      // Fetch delivery info separately
      const { data: deliveryInfo } = await supabase
        .from("delivery")
        .select(`
          delivery_id,
          delivery_status,
          courier_service,
          tracking_number,
          delivery_date,
          buyer_address_id,
          address (
            street,
            city,
            postal_code
          )
        `)
        .eq("order_id", orderId)
        .single()

      // Fetch payment info separately
      const { data: paymentInfo } = await supabase
        .from("payment")
        .select(`
          payment_id,
          payment_method,
          payment_status,
          paid_at
        `)
        .eq("order_id", orderId)
        .single()

      console.log("Order Info:", orderInfo)
      console.log("Delivery Info:", deliveryInfo)
      console.log("Payment Info:", paymentInfo)

      setOrderData(orderInfo)
      setDeliveryData(deliveryInfo)
      setPaymentData(paymentInfo)
    } catch (error) {
      console.error("Error fetching order data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl">Loading receipt...</p>
        </div>
      </CheckCredentials>
    )
  }

  if (!orderData) {
    return (
      <CheckCredentials>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-2xl text-red-600">Order not found</p>
        </div>
      </CheckCredentials>
    )
  }

  const totalAmount = orderData.order_item.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CheckCredentials>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-xl text-gray-600">Thank you for your purchase</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Order Information</h2>
              <div className="space-y-2 text-black">
                <p>
                  <span className="font-semibold">Order ID:</span> #{orderData.order_id}
                </p>
                <p>
                  <span className="font-semibold">Order Date:</span>{" "}
                  {new Date(orderData.ordered_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      orderData.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : orderData.status === "Confirmed"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {orderData.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Customer Information</h2>
              <div className="space-y-2 text-black">
                <p>
                  <span className="font-semibold">Name:</span> {orderData.buyer.first_name} {orderData.buyer.last_name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {orderData.buyer.email}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Order Items</h2>
            <div className="space-y-4">
              {orderData.order_item.map((item, index) => (
                <div key={index} className="flex items-center border-b border-gray-200 pb-4">
                  {item.product.product_image?.[0] && (
                    <img
                      src={item.product.product_image[0].image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-black">{item.product.name}</h3>
                    <p className="text-gray-600">{item.product.description}</p>
                    <p className="text-sm text-gray-500">Seller: {item.product.seller.seller_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">
                      ₱{item.product.price} x {item.quantity}
                    </p>
                    <p className="text-lg font-bold text-black">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-4 pt-4 border-t border-gray-200">
              <p className="text-2xl font-bold text-black">Total: ₱{totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Delivery Info */}
          {deliveryData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-black">Delivery Information</h2>
                <div className="space-y-2 text-black">
                  <p>
                    <span className="font-semibold">Courier:</span> {deliveryData.courier_service || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold">Tracking Number:</span>{" "}
                    {deliveryData.tracking_number || "Not assigned"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        deliveryData.delivery_status === "Preparing"
                          ? "bg-yellow-200 text-yellow-800"
                          : deliveryData.delivery_status === "Shipped"
                            ? "bg-blue-200 text-blue-800"
                            : deliveryData.delivery_status === "Delivered"
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {deliveryData.delivery_status || "Unknown"}
                    </span>
                  </p>
                  {deliveryData.delivery_date && (
                    <p>
                      <span className="font-semibold">Expected Delivery:</span>{" "}
                      {new Date(deliveryData.delivery_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-black">Delivery Address</h2>
                {deliveryData.address ? (
                  <div className="space-y-1 text-black">
                    <p>{deliveryData.address.street}</p>
                    <p>{deliveryData.address.city}</p>
                    {deliveryData.address.postal_code && <p>{deliveryData.address.postal_code}</p>}
                  </div>
                ) : (
                  <p className="text-gray-600">Address information not available</p>
                )}
              </div>
            </div>
          )}

          {/* Seller Address */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Shipping From</h2>
            {orderData.order_item[0]?.product.seller.address ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold mb-2 text-black">{orderData.order_item[0].product.seller.seller_name}</p>
                <div className="space-y-1 text-gray-600">
                  <p>{orderData.order_item[0].product.seller.address.street}</p>
                  <p>{orderData.order_item[0].product.seller.address.city}</p>
                  {orderData.order_item[0].product.seller.address.postal_code && (
                    <p>{orderData.order_item[0].product.seller.address.postal_code}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">Seller address information not available</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          {paymentData && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Payment Information</h2>
              <div className="space-y-2 text-black">
                <p>
                  <span className="font-semibold">Payment Method:</span> {paymentData.payment_method || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Payment Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      paymentData.payment_status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : paymentData.payment_status === "Success"
                          ? "bg-green-200 text-green-800"
                          : paymentData.payment_status === "Failed"
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {paymentData.payment_status || "Unknown"}
                  </span>
                </p>
                {paymentData.paid_at && (
                  <p>
                    <span className="font-semibold">Paid At:</span> {new Date(paymentData.paid_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Show message if delivery or payment data is missing */}
          {!deliveryData && (
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <p className="text-yellow-800">Delivery information is being processed and will be available soon.</p>
            </div>
          )}

          {!paymentData && (
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <p className="text-yellow-800">Payment information is being processed and will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </CheckCredentials>
  )
}

export default ViewReceipt
