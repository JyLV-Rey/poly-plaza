import { ShoppingBagIcon, ShoppingCart } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import OrderFilterBar from "./components/OrderFilterBar"
import EachOrder from "./components/EachOrder"

function ViewOrders() {
  const [searchParams] = useSearchParams()
  const buyerId = searchParams.get("buyerId")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("buyer_id", buyerId)
        .order("ordered_at", { ascending: false })

      if (!error) {
        setOrders(data || [])
      }

      setLoading(false)
    }

    fetchOrders()
  }, [buyerId])

  return (
    <>
      <div className="text-center flex flex-col w-full items-center justify-center mt-20 px-4">
        <div className="p-10 text-center flex flex-col w-full items-center justify-center">
          <div className="flex flex-row items-center space-x-2 mb-6">
            <ShoppingBagIcon className="text-neutral-700" />
            <h1 className="text-4xl font-bold text-center text-neutral-900">View Orders</h1>
          </div>

          {/* Optional: Add filters here */}
          <OrderFilterBar />

          {/* Show loader or content */}
          {loading ? (
            <div className="text-center mt-12 text-gray-500">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h3>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't made any purchases. Start exploring and order your favorite items!
                </p>
                <a
                  href="/search"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
                >
                  Browse Products
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-5 max-w-6xl">
              {orders.map((order) => (
                <EachOrder key={order.order_id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewOrders
