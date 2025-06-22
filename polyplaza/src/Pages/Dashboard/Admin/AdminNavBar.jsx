import { BaggageClaim, BaggageClaimIcon, Clipboard, ShoppingBag, StoreIcon } from "lucide-react"
import { Link } from "react-router-dom"


function AdminNavBar() {
  return (
    <div className="fixed z-50 w-full mt-20 text-sm flex p-1 flex-row justify-center items-center text-neutral-700 bg-neutral-300">
      <nav className="flex flex-row self-center gap-20  pl-20 pr-20 rounded-br-2xl rounded-bl-2xl">
        <Link to='/dashboard/admin/buyer' className="flex flex-row gap-2 items-center hover:scale-105 ease-(--my-beizer) duration-200 hover:font-bold hover:bg-neutral-500 hover:text-neutral-50 rounded-lg p-2
        ">
          <BaggageClaimIcon />
          <p>Buyers List</p>
        </Link>

        <Link to='/dashboard/admin/seller' className="flex flex-row gap-2 items-center hover:scale-105 ease-(--my-beizer) duration-200 hover:font-bold hover:bg-neutral-500 hover:text-neutral-50 rounded-lg p-2
        ">
          <StoreIcon />
          <p>Sellers List</p>
        </Link>

        <Link to='/dashboard/admin/order' className="flex flex-row gap-2 items-center hover:scale-105 ease-(--my-beizer) duration-200 hover:font-bold hover:bg-neutral-500 hover:text-neutral-50 rounded-lg p-2
        ">
          <ShoppingBag />
          <p>Orders List</p>
        </Link>

        <Link to='/dashboard/admin/application' className="flex flex-row gap-2 items-center hover:scale-105 ease-(--my-beizer) duration-200 hover:font-bold hover:bg-neutral-500 hover:text-neutral-50 rounded-lg p-2
        ">
          <Clipboard />
          <p>Applications List</p>
        </Link>
      </nav>
    </div>
  )
}

export default AdminNavBar