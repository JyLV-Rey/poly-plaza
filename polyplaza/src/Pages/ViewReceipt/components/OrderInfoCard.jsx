import { Package } from "lucide-react"

export default function OrderInfoCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Confirmed":
      case "Delivered":
      case "Success": return "bg-green-100 text-green-800"
      case "Preparing": return "bg-blue-100 text-blue-800"
      case "Shipped": return "bg-purple-100 text-purple-800"
      case "Failed": return "bg-red-100 text-red-800"
      case "Refunded": return "bg-red-100 text-red-800"
      case "Cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Package className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Order Information</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Order ID:</span>
          <span className="text-gray-900">#{order.order_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Order Date:</span>
          <span className="text-gray-900">{new Date(order.ordered_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
    </div>
  )
}
