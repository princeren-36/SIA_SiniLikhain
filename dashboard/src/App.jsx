import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Loginn";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />

        <Route path="/AddProduct" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App
