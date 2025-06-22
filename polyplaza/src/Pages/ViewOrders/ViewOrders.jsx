"use client"

import { ShoppingBagIcon } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import EachOrder from "./components/EachOrder"

function ViewOrders() {
  const [searchParams] = useSearchParams()
  const buyerId = searchParams.get("buyerId")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!buyerId) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("order")
          .select("*")
          .eq("buyer_id", buyerId)
          .order("ordered_at", { ascending: false })

        if (error) {
          console.error("Error fetching orders:", error)
        } else {
          setOrders(data || [])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [buyerId])

  return (
    <>
      <div className="text-center flex flex-col w-full items-center justify-center mt-15">
        <div className="p-10 text-center flex flex-col w-full items-center justify-center">
          <div className="flex flex-row items-center space-x-2">
            <ShoppingBagIcon className="text-neutral-700" />
            <h1 className="text-4xl font-bold text-center text-neutral-900">View Orders</h1>
          </div>

          {loading ? (
            <div className="text-center mt-12 text-gray-500">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h3>
                <p className="text-gray-600 mb-8">Discover amazing products and place your first order</p>
                <a
                  href="/search"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
                >
                  Start Shopping
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-row flex-wrap flex-grow items-center w-full gap-5 justify-between mt-5">
              <EachOrder buyerId={buyerId} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewOrders
