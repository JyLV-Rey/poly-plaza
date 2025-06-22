import { MapPin } from "lucide-react"

export default function AddressCard({ address }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <MapPin className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
      </div>
      {address ? (
        <div className="space-y-2">
          <p className="text-gray-900">{address.street}</p>
          <p className="text-gray-900">{address.city}</p>
          {address.postal_code && <p className="text-gray-900">{address.postal_code}</p>}
        </div>
      ) : (
        <p className="text-gray-600">Address information not available</p>
      )}
    </div>
  )
}
