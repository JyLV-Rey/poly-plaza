import { CreditCard } from "lucide-react"
import { getStatusColor } from "./utils"

export default function PaymentInfoCard({ payment }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Payment Method:</span>
          <span className="text-gray-900">{payment.payment_method || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Payment Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.payment_status)}`}>
            {payment.payment_status || "Unknown"}
          </span>
        </div>
        {payment.paid_at && (
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Paid At:</span>
            <span className="text-gray-900">{new Date(payment.paid_at).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
