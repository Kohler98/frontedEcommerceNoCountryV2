import React, { useState, useEffect, useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate,
  } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";


import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import RecoverPassword from "./pages/RecoverPassword";
import Me from "./pages/Me";
import Users from "./pages/Users";
import MisCompras from "./components/orders/MisCompras";
import MisPublicaciones from "./components/catalog/MisPublicaciones";
import Cart from "./pages/Cart";
import Success from "./pages/Success";

import ProductPage from "./pages/productsPage";
import { Checkout } from "./pages/Checkout";
import crudAxios from "./config/axios";
import RestorePassword from "./pages/RestorePassword";
import { CRMContext } from "./components/context/CRMcontext";
export default function AnimatedRoutes() {
    const location = useLocation();
    const navigate = useNavigate();
    const [auth, setAuth] = useContext(CRMContext);
    const {userRole} = auth
    // const [userRole, setUserRole] = useState(null);
    const [options, setOption] = useState({
      clientSecret: "",
    });
    const token = localStorage.getItem("x-token");
     
    // ... existing code ...
  
    // Fetch user data for role
    useEffect(() => {

      const fetchUserData = async () => {
      
        try {
   
          const config = {
            headers: { "x-token": token },
          };
  
          const response = await crudAxios.get("/me", config);

          setAuth({ token:token, isAuthenticated: true,userRole:response.data.usuario.role,idUsuario:response.data.usuario.id });
        } catch (error) {
          setAuth({ token:"", isAuthenticated: false,userRole:"",idUsuario:"" });
          localStorage.removeItem("x-token");
        }
      };
        if(token){
          fetchUserData();
      }
    
   
    }, [token]);
 


    // Redirect if not admin
    useEffect(() => {
      if (userRole !== "ADMIN_ROLE" && (location.pathname === '/catalog' || location.pathname === '/users')) {
        navigate('/');
      }
    }, [userRole, location.pathname, navigate]);
   
    
    // Animation variants
    const pageTransition = {
      in: {
        opacity: 1,
      },
      out: {
        opacity: 0,
      },
    };
  
    useEffect(() => {
      if (options.clientSecret.length > 0) {
        navigate("/checkout");
      }
    }, [options, navigate]);

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="out"
          animate="in"
          exit="out"
          variants={pageTransition}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/confirmar-cuenta/:id" element={<Signin />} />
            <Route path="/me" element={<Me />} />
            <Route path="/catalog" element={<MisPublicaciones />} />
            <Route path="/orders" element={<MisCompras />} />
            <Route path="/users" element={<Users />} />
            <Route path="/product/get/:slug" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart setOption={setOption} />} />
            <Route path="/checkout" element={<Checkout options={options} />} />
            <Route path="/recover" element={<RecoverPassword />} />
            <Route path="/restore/:id" element={<RestorePassword />} />
  
            <Route path="/success" element={<Success />} />
  
            {/* SEARCH AGREGADO */}
            <Route path="/search" element={<Home />} />
  
            {/* Add more routes as needed */}
          </Routes>
        </motion.div>
      </AnimatePresence>
    );


}