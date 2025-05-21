import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Loginn";
import Home from "./pages/Home";
import AddProduct from "./artisan/AddProduct";
import AboutBuyer from "./buyer/AboutBuyer";
import AboutArtisan from "./artisan/AboutArtisan";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Buyer from "./buyer/Buyer";
import Artisan from "./artisan/Artisan";
import Cart from "./buyer/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/AboutBuyer" element={<AboutBuyer />} />
        <Route path="/AboutArtisan" element={<AboutArtisan />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Buyer" element={<Buyer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Artisan" element={<Artisan />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
