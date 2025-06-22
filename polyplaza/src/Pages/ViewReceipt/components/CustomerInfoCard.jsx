import { User } from "lucide-react"

export default function CustomerInfoCard({ buyer }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <User className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Name:</span>
          <span className="text-gray-900">{buyer.first_name} {buyer.last_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900">{buyer.email}</span>
        </div>
      </div>
    </div>
  )
}
