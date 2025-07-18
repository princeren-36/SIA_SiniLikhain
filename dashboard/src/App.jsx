import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddProductPage from "./artisan/AddProductPage";
import AddProduct from "./artisan/AddProduct";
import ManageProducts from "./artisan/ManageProducts";
import AboutBuyer from "./buyer/AboutBuyer";
import AboutArtisan from "./artisan/AboutArtisan";
import Register from "./pages/Register";
import Admin from "./admin/Admin";
import Buyer from "./buyer/Buyer";
import BuyerProfile from "./buyer/BuyerProfile";
import Artisan from "./artisan/Artisan";
import Cart from "./buyer/Cart";
import Checkout from "./buyer/Checkout";
import RegisterArtisan from "./pages/RegisterArtisan";
import RegisterBuyer from "./pages/RegisterBuyer";
import ArtisanDashboard from "./artisan/ArtisanDashboard";
import ArtisanProfile from "./artisan/ArtisanProfile";
import ArtisanOrders from "./artisan/ArtisanOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import RequireAuth from "./utils/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AboutBuyer" element={<AboutBuyer />} />
        <Route path="/AboutArtisan" element={<AboutArtisan />} />
        <Route path="/Admin" element={<RequireAuth><Admin /></RequireAuth>} />
        <Route path="/Buyer" element={<Buyer />} />
        <Route path="/BuyerProfile" element={<RequireAuth><BuyerProfile /></RequireAuth>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/buyer/Checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/Artisan" element={<RequireAuth><Artisan /></RequireAuth>} />
        <Route path="/registerartisan" element={<RegisterArtisan />} />
        <Route path="/registerbuyer" element={<RegisterBuyer />} />
        <Route path="/artisan/dashboard" element={<RequireAuth><ArtisanDashboard /></RequireAuth>} />
        <Route path="/artisan/add-product" element={<RequireAuth><AddProductPage /></RequireAuth>} />
        <Route path="/artisan/products" element={<RequireAuth><AddProduct /></RequireAuth>} />
        <Route path="/artisan/manage-products" element={<RequireAuth><ManageProducts /></RequireAuth>} />
        <Route path="/artisan/profile" element={<RequireAuth><ArtisanProfile /></RequireAuth>} />
        <Route path="/artisan/orders" element={<RequireAuth><ArtisanOrders /></RequireAuth>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
