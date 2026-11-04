import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Service from "./pages/Service";
import Menu from "./pages/Menu";
import Contact from "./pages/contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Order from "./pages/Order";
import OrderStatus from "./pages/OrderStatus";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/order-status/:id" element={<OrderStatus />} />
      </Routes>

      <Chatbot />
    </>
  );
}

export default App;
