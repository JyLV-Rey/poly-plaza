import { Package } from "lucide-react"

export default function OrderNotFoundCard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
      <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  )
}
