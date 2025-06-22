export function getStatusColor(status) {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800"
    case "Confirmed":
    case "Delivered":
    case "Success": return "bg-green-100 text-green-800"
    case "Preparing": return "bg-blue-100 text-blue-800"
    case "Cancelled" : return "bg-red-100 text-red-800"
    case "Returned": return "bg-pink-100 text-pink-800"
    case "Shipped": return "bg-purple-100 text-purple-800"
    case "Failed": return "bg-red-100 text-red-800"
    case "Refunded": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}
