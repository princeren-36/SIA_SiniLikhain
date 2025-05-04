import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Loginn";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App
