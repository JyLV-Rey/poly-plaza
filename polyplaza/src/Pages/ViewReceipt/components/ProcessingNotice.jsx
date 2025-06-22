import { Calendar, CreditCard } from "lucide-react"

export function ProcessingDeliveryNotice() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
      <div className="flex items-center">
        <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
        <p className="text-yellow-800">Delivery information is being processed and will be available soon.</p>
      </div>
    </div>
  )
}

export function ProcessingPaymentNotice() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
      <div className="flex items-center">
        <CreditCard className="w-6 h-6 text-yellow-600 mr-3" />
        <p className="text-yellow-800">Payment information is being processed and will be available soon.</p>
      </div>
    </div>
  )
}
