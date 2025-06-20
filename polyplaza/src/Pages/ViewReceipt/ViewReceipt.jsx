"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "../../supabase"
import CheckCredentials from "../CheckCredentials"
import { CheckCircle, Package, CreditCard, Truck, MapPin, Store, Calendar, User } from "lucide-react"

function ViewReceipt() {
  const [searchParams] = useSearchParams()
  const orderId = Number(searchParams.get("orderId"))
  const justOrdered = searchParams.get("justOrdered");
  const [orderData, setOrderData] = useState(null)
  const [deliveryData, setDeliveryData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderData()
  }, [orderId])

  async function fetchOrderData() {
    try {
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
        <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  if (!orderData) {
    return (
      <CheckCredentials>
        <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
          <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </CheckCredentials>
    )
  }

  const totalAmount = orderData.order_item.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Preparing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Success":
        return "bg-green-100 text-green-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <CheckCredentials>
      <div className="min-h-screen min-w-screen bg-gray-50 pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          { justOrdered &&
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
                  <p className="text-xl text-gray-600 mt-2">Thank you for your purchase</p>
                </div>
              </div>
            </div>
          }


          <div className="space-y-6">
            {/* Order & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Package className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Order Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="text-gray-900">#{orderData.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Order Date:</span>
                    <span className="text-gray-900">{new Date(orderData.ordered_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                      {orderData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="text-gray-900">
                      {orderData.buyer.first_name} {orderData.buyer.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="text-gray-900">{orderData.buyer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>

              <div className="space-y-4">
                {orderData.order_item.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    {item.product.product_image?.[0] && (
                      <img
                        src={item.product.product_image[0].image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl mr-4"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-600">{item.product.description}</p>
                      <p className="text-sm text-gray-500">Seller: {item.product.seller.seller_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₱{item.product.price} x {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ₱{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right pt-6 border-t border-gray-200 mt-6">
                <p className="text-3xl font-bold text-blue-600">Total: ₱{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Delivery & Address Info */}
            {deliveryData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Courier:</span>
                      <span className="text-gray-900">{deliveryData.courier_service || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Tracking:</span>
                      <span className="text-gray-900">{deliveryData.tracking_number || "Not assigned"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryData.delivery_status)}`}
                      >
                        {deliveryData.delivery_status || "Unknown"}
                      </span>
                    </div>
                    {deliveryData.delivery_date && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Expected:</span>
                        <span className="text-gray-900">
                          {new Date(deliveryData.delivery_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                  </div>
                  {deliveryData.address ? (
                    <div className="space-y-2">
                      <p className="text-gray-900">{deliveryData.address.street}</p>
                      <p className="text-gray-900">{deliveryData.address.city}</p>
                      {deliveryData.address.postal_code && (
                        <p className="text-gray-900">{deliveryData.address.postal_code}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">Address information not available</p>
                  )}
                </div>
              </div>
            )}

            {/* Seller Address */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Store className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Shipping From</h2>
              </div>
              {orderData.order_item[0]?.product.seller.address ? (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="font-semibold mb-2 text-gray-900">
                    {orderData.order_item[0].product.seller.seller_name}
                  </p>
                  <div className="space-y-1 text-gray-600">
                    <p>{orderData.order_item[0].product.seller.address.street}</p>
                    <p>{orderData.order_item[0].product.seller.address.city}</p>
                    {orderData.order_item[0].product.seller.address.postal_code && (
                      <p>{orderData.order_item[0].product.seller.address.postal_code}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-gray-600">Seller address information not available</p>
                </div>
              )}
            </div>

            {/* Payment Info */}
            {paymentData && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Payment Method:</span>
                    <span className="text-gray-900">{paymentData.payment_method || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Payment Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentData.payment_status)}`}
                    >
                      {paymentData.payment_status || "Unknown"}
                    </span>
                  </div>
                  {paymentData.paid_at && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Paid At:</span>
                      <span className="text-gray-900">{new Date(paymentData.paid_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Processing Messages */}
            {!deliveryData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
                  <p className="text-yellow-800">Delivery information is being processed and will be available soon.</p>
                </div>
              </div>
            )}

            {!paymentData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-yellow-600 mr-3" />
                  <p className="text-yellow-800">Payment information is being processed and will be available soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CheckCredentials>
  )
}

export default ViewReceipt
