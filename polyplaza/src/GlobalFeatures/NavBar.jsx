"use client"

import { Link } from "react-router-dom"
import { useUser } from "../Pages/UserContext"
import { useNavigate } from "react-router-dom"

function NavBar() {
  const { userId, userFirstName, userLastName, userSellerId } = useUser()
  const TextClass =
    " text-lg text-neutral-700 hover:text-neutral-200 p-2 hover:text-2xl font-medium hover:font-extrabold hover:bg-neutral-500 rounded-md duration-200 ease-(--my-beizer)"
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
    <div className="fixed z-49 w-full flex flex-row items-center justify-between pl-2 pr-2 bg-neutral-100 shadow-lg/10 h-15 shadow-black gap-2">
      <div className="self-start justify-start">
        <img src="/logo.png" alt="" className="h-12 w-fit" />
      </div>
      <div>
        <nav className="flex flex-row justify-around w-full text-lg gap-2">
          <Link to="/" className={`${TextClass}`}>
            Home
          </Link>
          <Link to="/search" className={`${TextClass}`}>
            Search
          </Link>
          <Link to="/cart" className={`${TextClass}`}>
            Cart
          </Link>
          <Link to={`/dashboard/buyer?buyerId=${userId}`} className={`${TextClass}`}>
            Your Profile
          </Link>
          <Link to={`/dashboard/seller?sellerId=${userSellerId}`} className={`${TextClass}`}>
            Seller Dashboard
          </Link>
          {userId == null && (
            <>
              <Link to="/account/login" className={`${TextClass} text-neutral-500`}>
                Login
              </Link>
              <Link to="/account/create" className={`${TextClass}`}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
      {userId != null && (
        <>
          <div className="flex flex-row gap-2 border-2 border-emerald-500 bg-emerald-200 rounded-lg p-1 justify-end w-fit">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl text-emerald-500 font-bold text-center">
                {userFirstName} {userLastName}
              </h1>
            </div>
            <button
              className="p-2 text-white font-bold bg-red-600 rounded-xl w-fit hover:bg-amber-200 hover:border-2 hover:border-amber-500 hover:text-amber-500 hover:scale-110 hover:text-lg duration-200 ease-(--my-beizer)"
              onClick={Logout}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default NavBar
