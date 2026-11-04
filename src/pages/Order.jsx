import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./order.css";

function Order() {
  const [order, setOrder] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    guests: "",
    menuPackage: "",
    item: "",
    quantity: "",
    address: "",
    requirements: "",
  });
  const [placedOrderId, setPlacedOrderId] = useState("");

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/orders", order);
      setPlacedOrderId(response.data?.id || "");

      alert(
        `Order Placed Successfully! Your order ID is ${response.data?.id || "available in Admin"}.`,
      );

      setOrder({
        name: "",
        phone: "",
        email: "",
        eventType: "",
        eventDate: "",
        guests: "",
        menuPackage: "",
        item: "",
        quantity: "",
        address: "",
        requirements: "",
      });
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);

      alert(
        error.response?.data?.error ||
          error.message ||
          "Failed to submit order",
      );
    }
  };

  const estimatedCost = (Number(order.guests) || 0) * 60;

  return (
    <>
      <Header />

      <div className="order-container">
        <h2>Book Your Catering Service</h2>

        {placedOrderId && (
          <div className="order-success-box">
            <strong>Order placed successfully</strong>
            <p>
              Save your Order ID: <b>{placedOrderId}</b>
            </p>
            <Link to={`/order-status/${placedOrderId}`}>
              Track order status
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={order.name}
            placeholder="Enter Your Name"
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            value={order.phone}
            placeholder="Enter Phone Number"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={order.email}
            onChange={(e) =>
              setOrder({
                ...order,
                email: e.target.value,
              })
            }
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
            required
          />

          <select
            name="eventType"
            value={order.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Housewarming">Housewarming</option>
          </select>

          <input
            type="date"
            name="eventDate"
            value={order.eventDate}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="guests"
            value={order.guests}
            placeholder="Number of Guests"
            onChange={handleChange}
            required
          />

          <select
            name="menuPackage"
            value={order.menuPackage}
            onChange={handleChange}
            required
          >
            <option value="">Select Menu Package</option>
            <option value="Silver Package">Silver Package</option>
            <option value="Gold Package">Gold Package</option>
            <option value="Premium Package">Premium Package</option>
          </select>

          <select
            name="item"
            value={order.item}
            onChange={handleChange}
            required
          >
            <option value="">Select Menu Item</option>
            <option value="Paneer Tikka">Paneer Tikka</option>
            <option value="Hara Bhara Kebab">Hara Bhara Kebab</option>
            <option value="Paneer Butter Masala">Paneer Butter Masala</option>
            <option value="Veg Kolhapuri">Veg Kolhapuri</option>
            <option value="Veg Biryani">Veg Biryani</option>
            <option value="Jeera Rice">Jeera Rice</option>
            <option value="Butter Naan">Butter Naan</option>
            <option value="Gulab Jamun">Gulab Jamun</option>
            <option value="Ice Cream">Ice Cream</option>
          </select>

          <input
            type="number"
            name="quantity"
            value={order.quantity}
            placeholder="Quantity"
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            value={order.address}
            placeholder="Event Address"
            onChange={handleChange}
            required
          />

          <textarea
            name="requirements"
            value={order.requirements}
            placeholder="Special Requirements (Jain Food, Extra Sweets, Live Counter, etc.)"
            onChange={handleChange}
          />

          <h3>Estimated Cost: ₹{estimatedCost}</h3>

          <button type="submit">Place Order</button>
        </form>
      </div>
    </>
  );
}

export default Order;
