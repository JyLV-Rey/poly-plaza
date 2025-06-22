import { BaggageClaimIcon, Clipboard, ShoppingBag, StoreIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

function AdminNavBar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard/admin/buyer"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/dashboard/admin/buyer")
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BaggageClaimIcon className="w-5 h-5" />
            <span className="font-medium">Buyers List</span>
          </Link>

          <Link
            to="/dashboard/admin/seller"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/dashboard/admin/seller")
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <StoreIcon className="w-5 h-5" />
            <span className="font-medium">Sellers List</span>
          </Link>

          <Link
            to="/dashboard/admin/order"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/dashboard/admin/order")
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders List</span>
          </Link>

          <Link
            to="/dashboard/admin/application"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/dashboard/admin/application")
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Clipboard className="w-5 h-5" />
            <span className="font-medium">Applications</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default AdminNavBar