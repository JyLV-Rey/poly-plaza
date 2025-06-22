"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "../../supabase"
import CheckCredentials from "../CheckCredentials"

// Components
import HeaderConfirmation from "./components/HeaderConfirmation"
import OrderInfoCard from "./components/OrderInfoCard"
import CustomerInfoCard from "./components/CustomerInfoCard"
import OrderItemsList from "./components/OrderItemsList"
import DeliveryInfoCard from "./components/DeliveryInfoCard"
import AddressCard from "./components/AddressCard"
import SellerAddressCard from "./components/SellerAddressCard"
import PaymentInfoCard from "./components/PaymentInfoCard"
import LoadingSkeleton from "./components/LoadingSkeleton"
import OrderNotFoundCard from "./components/OrderNotFoundCard"
import { ProcessingDeliveryNotice, ProcessingPaymentNotice } from "./components/ProcessingNotice"

function ViewReceipt() {
  const [searchParams] = useSearchParams()
  const orderId = Number(searchParams.get("orderId"))
  const justOrdered = searchParams.get("justOrdered")
  const [orderData, setOrderData] = useState(null)
  const [deliveryData, setDeliveryData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)

  const canRefund = deliveryData?.delivery_status === "Delivered"
  const canCancel = deliveryData?.delivery_status === "Preparing"

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

      console.log(deliveryInfo.delivery_status)
      console.log(canRefund);
      
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
        <LoadingSkeleton />
      </CheckCredentials>
    )
  }

  if (!orderData) {
    return (
      <CheckCredentials>
        <OrderNotFoundCard />
      </CheckCredentials>
    )
  }

  async function handleRefund() {

    const reason = window.prompt("Please enter the reason for refund: ");

    const { error: paymentError } = await supabase
    .from("payment")
    .update({ payment_status: "Refunded" })
    .eq("order_id", orderId)
    .single()

    if (paymentError) {
      console.log(paymentError)
    }

    const { error: deliveryError } = await supabase
    .from("delivery")
    .update({ delivery_status: "Returned" })
    .eq("order_id", orderId)
    .single()

    if (deliveryError) {
      console.log(deliveryError)
    }

    const { error: orderError } = await supabase
    .from("order")
    .update({ status: "Refunded" })
    .eq("order_id", orderId)
    .single()

    if (orderError) {
      console.log(orderError)
    }

    const {error: refundError} = await supabase
    .from("refund")
    .insert({
      refund_reason: reason,
      order_id: orderId,
      refund_status: "Pending"
    })
    .single()

    if (refundError) {
      console.log(refundError)
    }

    window.location.reload()
  }

  async function handleCancel() {

    const reason = window.prompt("Please enter the reason for cancellation: ");

    const { error: deliveryError } = await supabase
    .from("delivery")
    .update({ delivery_status: "Cancelled" })
    .eq("order_id", orderId)
    .single()

    if (deliveryError) {
      console.log(deliveryError)
    }

    const { error: orderError } = await supabase
    .from("order")
    .update({ status: "Cancelled" })
    .eq("order_id", orderId)
    .single()

    if (orderError) {
      console.log(orderError)
    }

    const { error: paymentError } = await supabase
    .from("payment")
    .update({ payment_status: "Cancelled" })
    .eq("order_id", orderId)
    .single()

    if (paymentError) {
      console.log(paymentError)
    }

    const {error: cancelError} = await supabase
    .from("cancel")
    .insert({
      cancel_reason: reason,
      order_id: orderId
    })
    .single()

    if (cancelError) {
      console.log(cancelError)
    }

    window.location.reload()
  }


  const seller = orderData.order_item[0]?.product.seller

  return (
    <CheckCredentials>
      <div className="min-h-screen min-w-screen bg-gray-50 pt-20">
        <div className="w-full flex flex-col px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {justOrdered && <HeaderConfirmation />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderInfoCard order={orderData} />
            <CustomerInfoCard buyer={orderData.buyer} />
          </div>
          <OrderItemsList items={orderData.order_item} />
          {deliveryData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DeliveryInfoCard delivery={deliveryData} />
              <AddressCard address={deliveryData.address} />
            </div>
          ) : (
            <ProcessingDeliveryNotice />
          )}
          <SellerAddressCard seller={seller} />
          {paymentData ? (
            <PaymentInfoCard payment={paymentData} />
          ) : (
            <ProcessingPaymentNotice />
          )}
          <div className="flex justify-end space-x-4">
            <button disabled={!canCancel} onClick={handleCancel} className={`font-bold py-2 px-4 rounded ${canCancel ? "bg-red-500 hover:bg-red-100 hover:text-red-700 duration-300 hover:scale-105 ease-[var(--my-beizer)] border-red-700 hover:border-2 cursor-pointer" : "cursor-not-allowed bg-neutral-600 text-neutral-400"}`}>Cancel</button>
            <button disabled={!canRefund} onClick={handleRefund} className={`font-bold py-2 px-4 rounded ${canRefund ? "bg-amber-500 hover:bg-amber-100 hover:text-amber-700 duration-300 hover:scale-105 ease-[var(--my-beizer)] border-amber-700 cursor-pointer hover:border-2" : "cursor-not-allowed bg-neutral-600 text-neutral-400"}`}>Refund</button>
          </div>
        </div>
      </div>
    </CheckCredentials>
  )
}

export default ViewReceipt
