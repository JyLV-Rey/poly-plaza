import {Routes, Route} from 'react-router-dom';
import NavBar from './GlobalFeatures/NavBar';
import HomePage from './Pages/HomePage/HomePage';
import SearchPage from './Pages/SearchPage/SearchPage';
import ViewProduct from './Pages/ViewProduct/ViewProduct';
import LoginAccount from './Pages/Account/LoginAccount/LoginAccount';
import CreateAccount from './Pages/Account/CreateAccount/CreateAccount';
import BuyerDashboard from './Pages/Dashboard/BuyerDashboard/BuyerDashboard';
import SellerDashboard from './Pages/Dashboard/SellerDashbord/SellerDashboard';

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
        </Routes>
      </div>
    </>
  )
}

export default App
