import { CheckCircle } from "lucide-react"

export default function HeaderConfirmation() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <CheckCircle className="w-12 h-12 text-green-600 mr-4" />
        <div>
          <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mt-2">Thank you for your purchase</p>
        </div>
      </div>
    </div>
  )
}