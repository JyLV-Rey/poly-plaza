import { Routes, Route } from "react-router-dom"
import NavBar from "./GlobalFeatures/NavBar"
import HomePage from "./Pages/HomePage/HomePage"
import SearchPage from "./Pages/SearchPage/SearchPage"
import ViewProduct from "./Pages/ViewProduct/ViewProduct"
import LoginAccount from "./Pages/Account/LoginAccount/LoginAccount"
import CreateAccount from "./Pages/Account/CreateAccount/CreateAccount"
import BuyerDashboard from "./Pages/Dashboard/BuyerDashboard/BuyerDashboard"
import SellerDashboard from "./Pages/Dashboard/SellerDashbord/SellerDashboard"
import CartPage from "./Pages/CartPage/CartPage"
import ConfirmOrderPage from "./Pages/BuyPage/ConfirmOrderPage"
import ViewReceipt from "./Pages/ViewReceipt/ViewReceipt"
import Footer from "./GlobalFeatures/Footer"
import ViewOrders from "./Pages/ViewOrders/ViewOrders"
import EditBuyer from "./Pages/Account/EditAccount/EditBuyer"
import EditSeller from "./Pages/Account/EditAccount/EditSeller"
import EditAddress from "./GlobalFeatures/EditAddress"

function App() {
  return (
    <>
      <div div className="flex flex-col items-start justify-start min-h-screen w-screen bg-neutral-100">
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/account/login" element={<LoginAccount />} />
          <Route path="/account/create" element={<CreateAccount />} />
          <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
          <Route path="/product/view" element={<ViewProduct />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/confirm_order" element={<ConfirmOrderPage />} />
          <Route path="/product/view_receipt" element={<ViewReceipt />} />
          <Route path="/orders" element={<ViewOrders/>}/>
          <Route path="/edit/buyer" element={<EditBuyer/>}/>
          <Route path="/edit/seller" element={<EditSeller/>}/>
          <Route path="/edit/address" element={<EditAddress/>}/>
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
