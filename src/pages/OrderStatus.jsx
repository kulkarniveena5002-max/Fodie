import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import "../OrderStatus.css";

function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/orders/${id}/status`,
        );
        setOrder(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.error || "Order could not be found.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <>
      <Header />
      <main className="order-status-page">
        <section className="order-status-card">
          <span className="status-kicker">Order tracking</span>
          <h1>Check your order</h1>
          {loading && <p>Loading order details...</p>}
          {error && <div className="status-error">{error}</div>}
          {order && (
            <div className="order-status-content">
              <p className="order-reference">
                Order ID: <strong>#{order.id}</strong>
              </p>
              <div
                className={`large-order-status ${String(order.status || "Pending").toLowerCase()}`}
              >
                {order.status || "Pending"}
              </div>
              <p>
                <strong>{order.name}</strong>, your order is currently{" "}
                <b>{order.status || "Pending"}</b>.
              </p>
              <dl>
                <div>
                  <dt>Event</dt>
                  <dd>{order.eventType || "Catering event"}</dd>
                </div>
                <div>
                  <dt>Event date</dt>
                  <dd>{order.eventDate || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Menu item</dt>
                  <dd>
                    {order.item || order.menuPackage || "Custom catering"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
          <Link className="status-back-link" to="/">
            Back to home
          </Link>
        </section>
      </main>
    </>
  );
}

export default OrderStatus;
