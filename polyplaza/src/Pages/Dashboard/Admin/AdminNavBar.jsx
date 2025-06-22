"use client"

import { BaggageClaimIcon, Clipboard, ShoppingBag, StoreIcon, Menu, X, LucideBadgeDollarSign } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function AdminNavBar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Prevent navbar from expanding when clicking menu items
  const handleMenuClick = (e) => {
    // Don't prevent default - let the navigation happen
    // Just don't expand the navbar
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white shadow-lg border-r border-gray-200 z-40 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className={`${isCollapsed ? "p-3" : "p-6"}`}>
          {/* Toggle Button - consistent sizing */}
          <div className={`flex items-center mb-6 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            >
              {isCollapsed ? <Menu className="w-4 h-4 text-gray-600" /> : <X className="w-4 h-4 text-gray-600" />}
            </button>
            {!isCollapsed && <h2 className="text-xl font-semibold text-gray-900 ml-3">Admin Dashboard</h2>}
          </div>

          <nav className="space-y-2">
            <Link
              to="/dashboard/admin/buyer"
              onClick={handleMenuClick}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isActive("/dashboard/admin/buyer")
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
              title={isCollapsed ? "Buyers List" : ""}
            >
              <BaggageClaimIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Buyers List</span>}
            </Link>

            <Link
              to="/dashboard/admin/seller"
              onClick={handleMenuClick}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isActive("/dashboard/admin/seller")
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
              title={isCollapsed ? "Sellers List" : ""}
            >
              <StoreIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Sellers List</span>}
            </Link>

            <Link
              to="/dashboard/admin/order"
              onClick={handleMenuClick}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isActive("/dashboard/admin/order")
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
              title={isCollapsed ? "Orders List" : ""}
            >
              <ShoppingBag className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Orders List</span>}
            </Link>

            <Link
              to="/dashboard/admin/product"
              onClick={handleMenuClick}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isActive("/dashboard/admin/products")
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
              title={isCollapsed ? "Products List" : ""}
            >
              <LucideBadgeDollarSign className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Products List</span>}
            </Link>

            <Link
              to="/dashboard/admin/application"
              onClick={handleMenuClick}
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isActive("/dashboard/admin/application")
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
              title={isCollapsed ? "Applications" : ""}
            >
              <Clipboard className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Applications</span>}
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleSidebar} />}
    </>
  )
}

export default AdminNavBar
