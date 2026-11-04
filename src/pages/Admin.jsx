import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Admin.css";

const Icon = ({ children, size = 20 }) => (
  <svg
    aria-hidden="true"
    className="icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const UsersIcon = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);

const RefreshIcon = () => (
  <Icon size={17}>
    <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
    <path d="M3 5v5h5M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
    <path d="M21 19v-5h-5" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size={18}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Icon>
);

const LogoutIcon = () => (
  <Icon size={17}>
    <path d="M10 17l5-5-5-5M15 12H3" />
    <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
  </Icon>
);

const DeleteIcon = () => (
  <Icon size={16}>
    <path d="M3 6h18M9 6V4h6v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" />
  </Icon>
);

const MenuIcon = () => (
  <Icon>
    <path d="M4 5h16M4 12h16M4 19h16" />
    <circle cx="7" cy="5" r="1" fill="currentColor" />
    <circle cx="17" cy="12" r="1" fill="currentColor" />
    <circle cx="7" cy="19" r="1" fill="currentColor" />
  </Icon>
);

const getContactDate = (contact) =>
  contact.createdAt ||
  contact.created_at ||
  contact.timestamp ||
  contact.submittedAt ||
  contact.date ||
  null;

const formatContactDate = (contact) => {
  const rawDate = getContactDate(contact);
  if (!rawDate) return "Time unavailable";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState("");
  const [menus, setMenus] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSubmitting, setMenuSubmitting] = useState(false);
  const [menuDeletingId, setMenuDeletingId] = useState("");
  const [menuEditingId, setMenuEditingId] = useState("");
  const [menuForm, setMenuForm] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    image: "",
    imageFile: null,
  });
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    image: "",
    imageFile: null,
  });
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [serviceDeletingId, setServiceDeletingId] = useState("");
  const [serviceEditingId, setServiceEditingId] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [orderUpdatingId, setOrderUpdatingId] = useState("");
  const [reportPeriod, setReportPeriod] = useState("all");

  const navigate = useNavigate();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/contact");
      setContacts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("We couldn’t load your contact messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(async () => {
    setMenuLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/menu");
      setMenus(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Menu fetch error:", err);
      setMenus([]);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/services");
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Service fetch error:", err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await axios.get("http://localhost:5000/orders");
      const records = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || response.data?.data || [];
      setOrders(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Order fetch error:", err);
      setOrdersError(
        err.response?.data?.error ||
          "Orders could not be loaded from the server.",
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminLoggedIn")) {
      navigate("/Login");
      return;
    }

    fetchContacts();
    fetchMenus();
    fetchServices();
    fetchOrders();
  }, [fetchContacts, fetchMenus, fetchServices, fetchOrders, navigate]);

  useEffect(() => {
    const refreshTimer = window.setInterval(fetchContacts, 30000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchContacts]);

  useEffect(() => {
    const orderTimer = window.setInterval(fetchOrders, 30000);
    return () => window.clearInterval(orderTimer);
  }, [fetchOrders]);

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((item) =>
      [item.name, item.email, item.phone, item.message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [contacts, searchTerm]);

const reportOrders = useMemo(() => {
  if (reportPeriod === "all") return orders;

  const now = new Date();
  const startDate = new Date();

  if (reportPeriod === "today") {
    startDate.setHours(0, 0, 0, 0);
  }

  if (reportPeriod === "week") {
    startDate.setDate(now.getDate() - 7);
  }

  if (reportPeriod === "month") {
    startDate.setDate(now.getDate() - 30);
  }

  return orders.filter((order) => {
    const orderDate =
      order.created_at ||
      order.createdAt ||
      order.order_date ||
      order.eventDate;

    if (!orderDate) return false;

    return new Date(orderDate) >= startDate;
  });
}, [orders, reportPeriod]);

const reportStats = useMemo(() => {
  const pending = reportOrders.filter(
    (order) => (order.status || "Pending") === "Pending",
  ).length;

  const confirmed = reportOrders.filter(
    (order) => order.status === "Confirmed",
  ).length;

  const completed = reportOrders.filter(
    (order) => order.status === "Completed",
  ).length;

  const cancelled = reportOrders.filter(
    (order) => order.status === "Cancelled",
  ).length;

  // Your Order page currently calculates ₹60 per guest.
  const estimatedRevenue = reportOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => {
      const guests = Number(order.guests) || 0;
      return total + guests * 60;
    }, 0);

  const categoryCounts = menus.reduce((result, menu) => {
    const category = menu.category || "Other";
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {});

  return {
    totalOrders: reportOrders.length,
    pending,
    confirmed,
    completed,
    cancelled,
    estimatedRevenue,
    categoryCounts,
    totalMenus: menus.length,
    totalServices: services.length,
    totalCustomers: contacts.length,
  };
}, [reportOrders, menus, services, contacts]);

const downloadReportCSV = () => {
  const rows = [
    ["Joshi's Catering Report"],
    ["Report period", reportPeriod],
    [],
    ["Summary", "Value"],
    ["Total Orders", reportStats.totalOrders],
    ["Pending Orders", reportStats.pending],
    ["Confirmed Orders", reportStats.confirmed],
    ["Completed Orders", reportStats.completed],
    ["Cancelled Orders", reportStats.cancelled],
    ["Estimated Revenue", `₹${reportStats.estimatedRevenue}`],
    ["Total Menu Items", reportStats.totalMenus],
    ["Total Services", reportStats.totalServices],
    ["Total Customers", reportStats.totalCustomers],
    [],
    ["Order Details"],
    [
      "Customer",
      "Phone",
      "Email",
      "Event Type",
      "Guests",
      "Menu Package",
      "Status",
      "Event Date",
    ],
    ...reportOrders.map((order) => [
      order.name || "",
      order.phone || "",
      order.email || "",
      order.eventType || "",
      order.guests || "",
      order.menuPackage || "",
      order.status || "Pending",
      order.eventDate || "",
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `joshi-catering-report-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  link.click();
  URL.revokeObjectURL(url);
};

const printReport = () => {
  window.print();
};


  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/Login");
  };

  const handleMenuChange = (event) => {
    const { name, value, files } = event.target;
    setMenuForm((current) => ({
      ...current,
      [name]: name === "imageFile" ? files[0] : value,
    }));
  };

  const handleAddMenu = async (event) => {
    event.preventDefault();
    setMenuSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      Object.entries(menuForm).forEach(([key, value]) => {
        if (value !== null && value !== "" && key !== "imageFile")
          payload.append(key, key === "price" ? Number(value) : value);
      });
      if (menuForm.imageFile) payload.append("imageFile", menuForm.imageFile);
      const endpoint = menuEditingId
        ? `http://localhost:5000/menu/${menuEditingId}`
        : "http://localhost:5000/menu";
      const response = menuEditingId
        ? await axios.put(endpoint, payload)
        : await axios.post(endpoint, payload);
      const createdMenu = response.data?.menu || response.data;
      setMenus((current) =>
        menuEditingId
          ? current.map((item) =>
              (item.id || item._id) === menuEditingId ? createdMenu : item,
            )
          : [createdMenu, ...current],
      );
      setMenuEditingId("");
      setMenuForm({
        name: "",
        category: "Main Course",
        price: "",
        description: "",
        image: "",
        imageFile: null,
      });
    } catch (err) {
      console.error("Menu add error:", err);
      setError("Menu could not be saved. Check your menu API.");
    } finally {
      setMenuSubmitting(false);
    }
  };

  const handleDeleteMenu = async (menu) => {
    const menuId = menu._id || menu.id;
    if (!menuId) {
      setError("This menu has no ID, so it cannot be deleted.");
      return;
    }

    if (
      !window.confirm(
        `Delete ${menu.name || "this menu item"}? This cannot be undone.`,
      )
    )
      return;

    setMenuDeletingId(menuId);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/menu/${menuId}`);
      setMenus((current) =>
        current.filter((item) => (item._id || item.id) !== menuId),
      );
    } catch (err) {
      console.error("Menu delete error:", err);
      setError("Menu could not be deleted. Check your menu DELETE API.");
    } finally {
      setMenuDeletingId("");
    }
  };

  const startMenuEdit = (menu) => {
    setMenuEditingId(menu.id || menu._id);
    setMenuForm({
      name: menu.name || "",
      category: menu.category || "Main Course",
      price: menu.price || "",
      description: menu.description || "",
      image: menu.image || menu.image_url || "",
      imageFile: null,
    });
    document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelMenuEdit = () => {
    setMenuEditingId("");
    setMenuForm({
      name: "",
      category: "Main Course",
      price: "",
      description: "",
      image: "",
      imageFile: null,
    });
  };

  const handleServiceChange = (event) => {
    const { name, value, files } = event.target;
    setServiceForm((current) => ({
      ...current,
      [name]: name === "imageFile" ? files[0] : value,
    }));
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    setServiceSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(serviceForm).forEach(([key, value]) => {
        if (value && key !== "imageFile") payload.append(key, value);
      });
      if (serviceForm.imageFile)
        payload.append("imageFile", serviceForm.imageFile);
      const endpoint = serviceEditingId
        ? `http://localhost:5000/services/${serviceEditingId}`
        : "http://localhost:5000/services";
      const response = serviceEditingId
        ? await axios.put(endpoint, payload)
        : await axios.post(endpoint, payload);
      setServices((current) =>
        serviceEditingId
          ? current.map((item) =>
              (item.id || item._id) === serviceEditingId ? response.data : item,
            )
          : [response.data, ...current],
      );
      setServiceEditingId("");
      setServiceForm({
        title: "",
        description: "",
        image: "",
        imageFile: null,
      });
    } catch (err) {
      console.error("Service add error:", err);
      setError("Service could not be saved. Check your services API.");
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleDeleteService = async (service) => {
    const id = service._id || service.id;
    if (!id || !window.confirm(`Delete ${service.title || "this service"}?`))
      return;
    setServiceDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/services/${id}`);
      setServices((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
    } catch (err) {
      console.error("Service delete error:", err);
      setError("Service could not be deleted.");
    } finally {
      setServiceDeletingId("");
    }
  };

  const startServiceEdit = (service) => {
    setServiceEditingId(service.id || service._id);
    setServiceForm({
      title: service.title || "",
      description: service.description || "",
      image: service.image || service.image_url || "",
      imageFile: null,
    });
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelServiceEdit = () => {
    setServiceEditingId("");
    setServiceForm({
      title: "",
      description: "",
      image: "",
      imageFile: null,
    });
  };

  const updateOrderStatus = async (order, status) => {
    const id = order.id || order._id;
    setOrderUpdatingId(id);
    try {
      await axios.patch(`http://localhost:5000/orders/${id}/status`, {
        status,
      });
      setOrders((current) =>
        current.map((item) =>
          (item.id || item._id) === id ? { ...item, status } : item,
        ),
      );
    } catch (err) {
      console.error("Order status error:", err);
      setError("Order status could not be updated.");
    } finally {
      setOrderUpdatingId("");
    }
  };

  const handleDelete = async (contact) => {
    const contactId = contact._id || contact.id;

    if (!contactId) {
      setError("This message has no ID, so it cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the message from ${contact.name || "this visitor"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(contactId);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/contact/${contactId}`);
      setContacts((current) =>
        current.filter((item) => (item._id || item.id) !== contactId),
      );
    } catch (err) {
      console.error("Delete Error:", err);
      setError("We couldn’t delete this message. Please try again.");
    } finally {
      setDeletingId("");
    }
  };

  const handleReplyChange = (contactId, value) => {
    setReplyDrafts((current) => ({ ...current, [contactId]: value }));
  };

  const handleSendReply = async (contact) => {
    const contactId = contact.id || contact._id;
    const reply = String(replyDrafts[contactId] || "").trim();
    if (!contactId || !reply) return;

    setReplyingId(contactId);
    try {
      const response = await axios.patch(
        `http://localhost:5000/contact/${contactId}/reply`,
        { reply },
      );
      setContacts((current) =>
        current.map((item) =>
          (item.id || item._id) === contactId
            ? {
                ...item,
                admin_reply: response.data.reply,
                replied_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setReplyDrafts((current) => ({ ...current, [contactId]: "" }));
    } catch (err) {
      console.error("Reply error:", err);
      setError(err.response?.data?.error || "Reply could not be sent.");
    } finally {
      setReplyingId("");
    }
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">A</div>
          <div>
            <strong>
              Admin<span>Panel</span>
            </strong>
            <small>Workspace</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#contacts">
            <MailIcon />
            <span>Contact messages</span>
            <b>{contacts.length}</b>
          </a>
          <a className="nav-item" href="#menus">
            <MenuIcon />
            <span>Menu management</span>
            <b>{menus.length}</b>
          </a>
          <a className="nav-item" href="#services">
            <MenuIcon />
            <span>Services</span>
            <b>{services.length}</b>
          </a>
          <a className="nav-item" href="#orders">
            <MailIcon />
            <span>Orders</span>
            <b>{orders.length}</b>
          </a>
          <a className="nav-item" href="#reports">
            <MenuIcon />
            <span>Reports</span>
          </a>

        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="avatar">AD</div>
            <div>
              <strong>Administrator</strong>
              <small>Signed in</small>
            </div>
          </div>
          <button
            className="sidebar-logout"
            type="button"
            onClick={handleLogout}
          >
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Good morning, Admin</h1>
            <p className="subtitle">
              Stay on top of conversations from your website.
            </p>
          </div>
          <button className="logout-btn" type="button" onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </button>
        </header>

        <div className="stats-grid">
          <article className="stat-card accent-purple">
            <div className="stat-icon">
              <UsersIcon />
            </div>
            <div>
              <span>Total contacts</span>
              <strong>{contacts.length}</strong>
              <small>All submissions</small>
            </div>
          </article>
          <article className="stat-card accent-blue">
            <div className="stat-icon">
              <MailIcon />
            </div>
            <div>
              <span>Visible results</span>
              <strong>{filteredContacts.length}</strong>
              <small>
                {searchTerm ? "Matching search" : "Currently listed"}
              </small>
            </div>
          </article>
          <article className="stat-card accent-green">
            <div className="stat-icon pulse-dot" />
            <div>
              <span>System status</span>
              <strong className="status-text">Operational</strong>
              <small>API connection ready</small>
            </div>
          </article>
        </div>

        <section className="messages-panel" id="contacts">
          <div className="panel-heading">
            <div>
              <div className="title-row">
                <h2>Contact messages</h2>
                <span className="count-pill">{contacts.length}</span>
              </div>
              <p>Review and manage messages submitted by your visitors.</p>
            </div>
            <button
              className="refresh-btn"
              type="button"
              onClick={fetchContacts}
              disabled={loading}
            >
              <RefreshIcon />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <SearchIcon />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search messages..."
                aria-label="Search messages"
              />
            </label>
            <span className="results-label">
              Showing <strong>{filteredContacts.length}</strong> of{" "}
              {contacts.length}
            </span>
          </div>

          {error ? (
            <div className="state-box error-state">
              <strong>Something went wrong</strong>
              <p>{error}</p>
              <button type="button" onClick={fetchContacts}>
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="state-box">
              <div className="loader" />
              <p>Loading your messages...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="state-box empty-state">
              <div className="empty-icon">
                <MailIcon />
              </div>
              <strong>
                {searchTerm ? "No matching messages" : "No contact records yet"}
              </strong>
              <p>
                {searchTerm
                  ? "Try a different name, email, or keyword."
                  : "New website enquiries will appear here."}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Received</th>
                    <th>Reply</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((item, index) => (
                    <tr key={item._id || item.id || index}>
                      <td>
                        <div className="contact-cell">
                          <div className="contact-avatar">
                            {String(item.name || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong>{item.name || "Unnamed visitor"}</strong>
                            <span>{item.email || "No email provided"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="phone-cell">{item.phone || "—"}</td>
                      <td>
                        <p className="message-preview" title={item.message}>
                          {item.message || "No message provided"}
                        </p>
                      </td>
                      <td>
                        <span className="date-label">
                          {formatContactDate(item)}
                        </span>
                      </td>
                      <td>
                        <div className="reply-cell">
                          {item.admin_reply && (
                            <small className="saved-reply">
                              Replied: {item.admin_reply}
                            </small>
                          )}
                          <textarea
                            value={replyDrafts[item.id || item._id] || ""}
                            onChange={(event) =>
                              handleReplyChange(
                                item.id || item._id,
                                event.target.value,
                              )
                            }
                            placeholder="Write a reply..."
                            rows="2"
                          />
                          <button
                            className="reply-btn"
                            type="button"
                            onClick={() => handleSendReply(item)}
                            disabled={
                              replyingId === (item.id || item._id) ||
                              !String(
                                replyDrafts[item.id || item._id] || "",
                              ).trim()
                            }
                          >
                            {replyingId === (item.id || item._id)
                              ? "Sending..."
                              : "Send reply"}
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === (item._id || item.id)}
                          aria-label={`Delete message from ${item.name || "visitor"}`}
                        >
                          <DeleteIcon />
                          {deletingId === (item._id || item.id)
                            ? "Deleting"
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="menu-management-panel" id="menus">
          <div className="panel-heading">
            <div>
              <div className="title-row">
                <h2>Menu management</h2>
                <span className="count-pill">{menus.length}</span>
              </div>
              <p>Add and manage items that appear on your restaurant menu.</p>
            </div>
            <button
              className="refresh-btn"
              type="button"
              onClick={fetchMenus}
              disabled={menuLoading}
            >
              <RefreshIcon />
              {menuLoading ? "Refreshing..." : "Refresh menus"}
            </button>
          </div>

          <form className="menu-form" onSubmit={handleAddMenu}>
            <label>
              <span>Menu name</span>
              <input
                name="name"
                value={menuForm.name}
                onChange={handleMenuChange}
                placeholder="e.g. Paneer Tikka"
                required
              />
            </label>
            <label>
              <span>Category</span>
              <select
                name="category"
                value={menuForm.category}
                onChange={handleMenuChange}
              >
                <option>Starters</option>
                <option>Main Course</option>
                <option>Breads</option>
                <option>Desserts</option>
                <option>Beverages</option>
              </select>
            </label>
            <label>
              <span>Price (₹)</span>
              <input
                name="price"
                type="number"
                min="0"
                value={menuForm.price}
                onChange={handleMenuChange}
                placeholder="250"
                required
              />
            </label>
            <label className="menu-description-field">
              <span>Description</span>
              <textarea
                name="description"
                value={menuForm.description}
                onChange={handleMenuChange}
                placeholder="Short description of the dish"
                rows="2"
                required
              />
            </label>
            <label className="menu-image-field">
              <span>
                Image URL <small>(optional)</small>
              </span>
              <input
                name="image"
                type="url"
                value={menuForm.image}
                onChange={handleMenuChange}
                placeholder="https://..."
              />
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleMenuChange}
              />
            </label>
            <button
              className="add-menu-btn"
              type="submit"
              disabled={menuSubmitting}
            >
              {menuSubmitting
                ? menuEditingId
                  ? "Saving..."
                  : "Adding..."
                : menuEditingId
                  ? "Save menu changes"
                  : "+ Add menu item"}
            </button>
            {menuEditingId && (
              <button
                className="cancel-edit-btn"
                type="button"
                onClick={cancelMenuEdit}
              >
                Cancel edit
              </button>
            )}
          </form>

          {menus.length > 0 && (
            <div className="menu-items-grid">
              {menus.map((menu, index) => (
                <article
                  className="menu-admin-card"
                  key={menu._id || menu.id || index}
                >
                  {menu.image ? (
                    <img src={menu.image} alt={menu.name} />
                  ) : (
                    <div className="menu-card-placeholder">
                      <MenuIcon />
                    </div>
                  )}
                  <div className="menu-card-content">
                    <span className="menu-category">
                      {menu.category || "Menu item"}
                    </span>
                    <h3>{menu.name}</h3>
                    <p>{menu.description}</p>
                    <strong>₹{menu.price}</strong>
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => startMenuEdit(menu)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => handleDeleteMenu(menu)}
                      disabled={menuDeletingId === (menu._id || menu.id)}
                    >
                      <DeleteIcon />
                      {menuDeletingId === (menu._id || menu.id)
                        ? "Deleting"
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="management-panel" id="services">
          <div className="panel-heading">
            <div>
              <div className="title-row">
                <h2>Services management</h2>
                <span className="count-pill">{services.length}</span>
              </div>
              <p>
                Add services that should appear on the public Services page.
              </p>
            </div>
          </div>
          <form className="service-form" onSubmit={handleAddService}>
            <label>
              <span>Service title</span>
              <input
                name="title"
                value={serviceForm.title}
                onChange={handleServiceChange}
                placeholder="Wedding Catering"
                required
              />
            </label>
            <label className="wide-field">
              <span>Description</span>
              <textarea
                name="description"
                value={serviceForm.description}
                onChange={handleServiceChange}
                placeholder="Describe this service"
                rows="2"
                required
              />
            </label>
            <label>
              <span>Image URL / file (optional)</span>
              <input
                name="image"
                type="url"
                value={serviceForm.image}
                onChange={handleServiceChange}
                placeholder="https://..."
              />
              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleServiceChange}
              />
            </label>
            <button
              className="add-menu-btn"
              type="submit"
              disabled={serviceSubmitting}
            >
              {serviceSubmitting
                ? serviceEditingId
                  ? "Saving..."
                  : "Adding..."
                : serviceEditingId
                  ? "Save service changes"
                  : "+ Add service"}
            </button>
            {serviceEditingId && (
              <button
                className="cancel-edit-btn"
                type="button"
                onClick={cancelServiceEdit}
              >
                Cancel edit
              </button>
            )}
          </form>
          {services.length > 0 && (
            <div className="admin-simple-list">
              {services.map((service, index) => (
                <div
                  className="admin-simple-row"
                  key={service._id || service.id || index}
                >
                  <div>
                    <strong>{service.title}</strong>
                    <p>{service.description}</p>
                  </div>
                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() => startServiceEdit(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => handleDeleteService(service)}
                    disabled={serviceDeletingId === (service._id || service.id)}
                  >
                    <DeleteIcon />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

       <section className="management-panel reports-panel" id="reports">
  <div className="panel-heading">
    <div>
      <div className="title-row">
        <h2>Reports & Analytics</h2>
      </div>
      <p>
        View orders, estimated revenue, customers and menu performance.
      </p>
    </div>

    <div className="report-actions">
      <select
        value={reportPeriod}
        onChange={(event) => setReportPeriod(event.target.value)}
        className="report-filter"
      >
        <option value="all">All time</option>
        <option value="today">Today</option>
        <option value="week">Last 7 days</option>
        <option value="month">Last 30 days</option>
      </select>

      <button
        type="button"
        className="refresh-btn"
        onClick={downloadReportCSV}
      >
        Download CSV
      </button>

      <button
        type="button"
        className="refresh-btn"
        onClick={printReport}
      >
        Print / PDF
      </button>
    </div>
  </div>

  <div className="report-stats-grid">
    <article className="report-card purple">
      <span>Total Orders</span>
      <strong>{reportStats.totalOrders}</strong>
      <small>Orders received</small>
    </article>

    <article className="report-card blue">
      <span>Estimated Revenue</span>
      <strong>₹{reportStats.estimatedRevenue}</strong>
      <small>Cancelled orders excluded</small>
    </article>

    <article className="report-card green">
      <span>Completed Orders</span>
      <strong>{reportStats.completed}</strong>
      <small>Successfully completed</small>
    </article>

    <article className="report-card orange">
      <span>Total Customers</span>
      <strong>{reportStats.totalCustomers}</strong>
      <small>Contact submissions</small>
    </article>
  </div>

  <div className="report-columns">
    <div className="report-box">
      <h3>Order Status Report</h3>

      <div className="report-row">
        <span>Pending</span>
        <strong>{reportStats.pending}</strong>
      </div>

      <div className="report-row">
        <span>Confirmed</span>
        <strong>{reportStats.confirmed}</strong>
      </div>

      <div className="report-row">
        <span>Completed</span>
        <strong>{reportStats.completed}</strong>
      </div>

      <div className="report-row">
        <span>Cancelled</span>
        <strong>{reportStats.cancelled}</strong>
      </div>
    </div>

    <div className="report-box">
      <h3>Menu Category Report</h3>

      {Object.keys(reportStats.categoryCounts).length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        Object.entries(reportStats.categoryCounts).map(
          ([category, count]) => (
            <div className="report-row" key={category}>
              <span>{category}</span>
              <strong>{count} items</strong>
            </div>
          ),
        )
      )}

      <div className="report-row total-row">
        <span>Total Menu Items</span>
        <strong>{reportStats.totalMenus}</strong>
      </div>
    </div>

    <div className="report-box">
      <h3>Business Summary</h3>

      <div className="report-row">
        <span>Total Services</span>
        <strong>{reportStats.totalServices}</strong>
      </div>

      <div className="report-row">
        <span>Total Customers</span>
        <strong>{reportStats.totalCustomers}</strong>
      </div>

      <div className="report-row">
        <span>Filtered Orders</span>
        <strong>{reportStats.totalOrders}</strong>
      </div>
    </div>
  </div>

  <div className="report-box report-orders">
    <h3>Order Report</h3>

    {reportOrders.length === 0 ? (
      <p>No orders found for this period.</p>
    ) : (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Event</th>
              <th>Guests</th>
              <th>Package</th>
              <th>Status</th>
              <th>Estimated Amount</th>
            </tr>
          </thead>

          <tbody>
            {reportOrders.map((order, index) => (
              <tr key={order.id || order._id || index}>
                <td>
                  <strong>{order.name || "Customer"}</strong>
                  <small>{order.phone || order.email || ""}</small>
                </td>
                <td>{order.eventType || "Catering event"}</td>
                <td>{order.guests || 0}</td>
                <td>{order.menuPackage || "Custom"}</td>
                <td>
                  <span
                    className={`order-status ${String(
                      order.status || "Pending",
                    ).toLowerCase()}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </td>
                <td>
                  ₹{(Number(order.guests) || 0) * 60}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>

        

        <section className="management-panel" id="orders">
          <div className="panel-heading">
            <div>
              <div className="title-row">
                <h2>Orders</h2>
                <span className="count-pill">{orders.length}</span>
              </div>
              <p>Review customer orders and update their status.</p>
            </div>
            <button
              className="refresh-btn"
              type="button"
              onClick={fetchOrders}
              disabled={ordersLoading}
            >
              <RefreshIcon />
              {ordersLoading ? "Refreshing..." : "Refresh orders"}
            </button>
          </div>
          {ordersError ? (
            <div className="state-box error-state">
              <strong>Orders could not be loaded</strong>
              <p>{ordersError}</p>
              <button type="button" onClick={fetchOrders}>
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="state-box">
              <p>No orders received yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                <article
                  className="order-admin-card"
                  key={order.id || order._id || index}
                >
                  <div>
                    <strong>{order.name || "Customer"}</strong>
                    <span>{order.phone || order.email || "No contact"}</span>
                    <p>
                      {order.item || order.menuPackage || "Catering order"} ·{" "}
                      {order.quantity || 1} quantity · {order.guests || 0}{" "}
                      guests
                    </p>
                    <small>{order.address || "Address not provided"}</small>
                  </div>
                  <div className="order-status-controls">
                    <span
                      className={`order-status ${String(order.status || "Pending").toLowerCase()}`}
                    >
                      {order.status || "Pending"}
                    </span>
                    <select
                      value={order.status || "Pending"}
                      onChange={(event) =>
                        updateOrderStatus(order, event.target.value)
                      }
                      disabled={orderUpdatingId === (order.id || order._id)}
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          AdminPanel <span>•</span> Contact management dashboard
        </footer>
      </section>
    </main>
  );
}

export default Dashboard;
