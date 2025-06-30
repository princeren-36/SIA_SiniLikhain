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
import Artisan from "./artisan/Artisan";
import Cart from "./buyer/Cart";
import Checkout from "./buyer/Checkout";
import RegisterArtisan from "./pages/RegisterArtisan";
import RegisterBuyer from "./pages/RegisterBuyer";
import ArtisanDashboard from "./artisan/ArtisanDashboard";
import ArtisanProfile from "./artisan/ArtisanProfile";
import ArtisanOrders from "./artisan/ArtisanOrders";
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
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Buyer" element={<Buyer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/buyer/Checkout" element={<Checkout />} />
        <Route path="/Artisan" element={<Artisan />} />
        <Route path="/registerartisan" element={<RegisterArtisan />} />
        <Route path="/registerbuyer" element={<RegisterBuyer />} />
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
        <Route path="/artisan/add-product" element={<AddProductPage />} />
        <Route path="/artisan/products" element={<AddProduct />} />
        <Route path="/artisan/manage-products" element={<ManageProducts />} />
        <Route path="/artisan/profile" element={<ArtisanProfile />} />
        <Route path="/artisan/orders" element={<ArtisanOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
