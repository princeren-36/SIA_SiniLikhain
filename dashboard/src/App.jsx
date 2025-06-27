import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddProduct from "./artisan/AddProduct";
import AboutBuyer from "./buyer/AboutBuyer";
import AboutArtisan from "./artisan/AboutArtisan";
import Register from "./pages/Register";
import Admin from "./admin/Admin";
import Buyer from "./buyer/Buyer";
import Artisan from "./artisan/Artisan";
import Cart from "./buyer/Cart";
import RegisterArtisan from "./pages/RegisterArtisan";
import RegisterBuyer from "./pages/RegisterBuyer";
import ArtisanDashboard from "./artisan/ArtisanDashboard";
import ProductList from "./artisan/ProductList";
import ManageProducts from "./artisan/ManageProducts";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/AboutBuyer" element={<AboutBuyer />} />
        <Route path="/AboutArtisan" element={<AboutArtisan />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Buyer" element={<Buyer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Artisan" element={<Artisan />} />
        <Route path="/registerartisan" element={<RegisterArtisan />} />
        <Route path="/registerbuyer" element={<RegisterBuyer />} />
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
        <Route path="/artisan/products" element={<ProductList />} />
        <Route path="/artisan/add-product" element={<AddProduct />} />
        <Route path="/artisan/manage-products" element={<ManageProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
