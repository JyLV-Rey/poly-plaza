export default function OrderItemsList({ items }) {
  const totalAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl">
            {item.product.product_image?.[0] && (
              <img
                src={item.product.product_image[0].image_url || "/placeholder.svg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-xl mr-4"
              />
            )}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
              <p className="text-gray-600">{item.product.description}</p>
              <p className="text-sm text-gray-500">Seller: {item.product.seller.seller_name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">₱{item.product.price} x {item.quantity}</p>
              <p className="text-lg font-bold text-blue-600">₱{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right pt-6 border-t border-gray-200 mt-6">
        <p className="text-3xl font-bold text-blue-600">Total: ₱{totalAmount.toFixed(2)}</p>
      </div>
    </div>
  )
}
