"use client"

import { Link } from "react-router-dom"
import { useUser } from "../Pages/UserContext"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, User, Home, Store, LogOut, ShoppingBag, Lock } from 'lucide-react'

function NavBar() {
  const { userId, userFirstName, userLastName, userSellerId } = useUser()
  const navigate = useNavigate()

  function Logout() {
    localStorage.removeItem("userId")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userFirstName")
    localStorage.removeItem("userLastName")
    localStorage.removeItem("userSellerId")
    localStorage.removeItem("userSellerName")
    navigate("/account/login")
    window.location.reload()
  }

  return (
    <div className="fixed z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="pl-10 pr-10">
        <div className="flex flex-row items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="PolyPlaza" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-gray-900">PolyPlaza</span>
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>

            <Link
              to="/cart"
              className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
            </Link>

            <Link
              to={`/orders?buyerId=${userId}`}
              className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Orders
            </Link>

            <Link
              to={`/dashboard/buyer?buyerId=${userId}`}
              className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <User className="w-5 h-5 mr-2" />
              Buyer Dashboard
            </Link>

            {userSellerId && (
              <Link
                to={`/dashboard/seller?sellerId=${userSellerId}`}
                className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <Store className="w-5 h-5 mr-2" />
                Seller Dashboard
              </Link>
            )}
            {
              (userId == 1003) && (
                <Link
                  to={`/dashboard/admin/buyer`}
                  className="flex items-center px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Link>
              )
            }
          </nav>

          {/* User Section - Far Right */}
          <div className="flex items-center space-x-4">
            {userId ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/edit/buyer?buyerId=${userId}`}
                  className="flex items-center space-x-2 bg-blue-50 px-4 py-3 rounded-full hover:bg-blue-100 transition-colors duration-200"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-medium text-gray-900">
                    {userFirstName} {userLastName}
                  </span>
                </Link>
                <button
                  onClick={Logout}
                  className="flex items-center px-4 py-3 rounded-full text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/account/login"
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/account/create"
                  className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
