import { Truck } from "lucide-react"
import { getStatusColor } from "./utils"

export default function DeliveryInfoCard({ delivery }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Truck className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Courier:</span>
          <span className="text-gray-900">{delivery.courier_service || "Not specified"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Tracking:</span>
          <span className="text-gray-900">{delivery.tracking_number || "Not assigned"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.delivery_status)}`}>
            {delivery.delivery_status || "Unknown"}
          </span>
        </div>
        {delivery.delivery_date && (
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Expected:</span>
            <span className="text-gray-900">{new Date(delivery.delivery_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
