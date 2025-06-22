import { Store } from "lucide-react"

export default function SellerAddressCard({ seller }) {
  const address = seller.address
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Store className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Shipping From</h2>
      </div>
      {address ? (
        <div className="bg-gray-50 p-4 rounded-2xl">
          <p className="font-semibold mb-2 text-gray-900">{seller.seller_name}</p>
          <div className="space-y-1 text-gray-600">
            <p>{address.street}</p>
            <p>{address.city}</p>
            {address.postal_code && <p>{address.postal_code}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-2xl">
          <p className="text-gray-600">Seller address information not available</p>
        </div>
      )}
    </div>
  )
}
