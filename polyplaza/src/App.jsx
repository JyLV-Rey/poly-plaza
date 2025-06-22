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
import CreateProduct from "./Pages/Product/CreateProduct"
import EditProduct from "./Pages/Product/EditProduct"
import BuyersView from "./Pages/Dashboard/Admin/BuyersView/BuyersView"
import SellersView from "./Pages/Dashboard/Admin/SellersView/SellersView"
import OrdersView from "./Pages/Dashboard/Admin/OrdersView/OrdersView"
import ApplicationsView from "./Pages/Dashboard/Admin/ApplicationView/ApplicationsView"
import ProductsView from "./Pages/Dashboard/Admin/ProductsView/ProductsView"
import AddAddress from "./GlobalFeatures/AddAddress"

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
          <Route path='/product/create' element={<CreateProduct/>}/>
          <Route path='/product/edit' element={<EditProduct/>}/>
          <Route path="/orders" element={<ViewOrders/>}/>
          <Route path="/edit/buyer" element={<EditBuyer/>}/>
          <Route path="/edit/seller" element={<EditSeller/>}/>
          <Route path="/edit/address" element={<EditAddress/>}/>
          <Route path="/add/address" element={<AddAddress/>}/>
          <Route path="/dashboard/admin/buyer" element={<BuyersView />} />
          <Route path="/dashboard/admin/seller" element={<SellersView />} />
          <Route path="/dashboard/admin/order" element={<OrdersView />} />
          <Route path="/dashboard/admin/application" element={<ApplicationsView />} />
          <Route path="/dashboard/admin/product" element={<ProductsView />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
