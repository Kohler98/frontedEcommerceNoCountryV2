import React, { useState} from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";


import Navbar from "./components/shared/Navbar";

import Footer from "./components/shared/Footer";
import { CRMContext, CRMProvider } from "./components/context/CRMcontext";

import { CartProvider } from "./components/context/CartContext";

import AnimatedRoutes from "./AnimatedRoutes";


export default function App() {
  const [auth, setAuth] = useState({
    token: "",
    isAuthenticated: false,
    userRole:""
  });

  return (
    <CRMProvider value={[auth, setAuth]}>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="min-h-screen bg-gray-100">
            <AnimatedRoutes />
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </CRMProvider>
  );
}
