import React, { useState } from "react";
import axios from "axios";
import "../Contact.css";
import Header from "../components/Header";

const initialForm = { name: "", email: "", phone: "", message: "" };

const ContactIcon = ({ children }) => (
  <svg
    className="contact-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [contactId, setContactId] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [checkingReply, setCheckingReply] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (status.type) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await axios.post(
        "http://localhost:5000/contact",
        formData,
      );
      setContactId(response.data?.id || "");
      setAdminReply("");
      setFormData(initialForm);
      setStatus({
        type: "success",
        message: `Your enquiry was sent successfully. Save message ID ${response.data?.id || "shown in your confirmation"} to check our reply.`,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message: "We could not send your message right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const checkAdminReply = async () => {
    if (!contactId) return;
    setCheckingReply(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/contact/${contactId}`,
      );
      setAdminReply(
        response.data?.admin_reply ||
          "Our team has not replied yet. Please check again soon.",
      );
    } catch (error) {
      setAdminReply("We could not check the reply right now.");
    } finally {
      setCheckingReply(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />
      <main>
        <section className="contact-hero">
          <div className="contact-hero-content">
            <span className="contact-kicker">
              ✦ Let&apos;s create something memorable
            </span>
            <h1>
              We&apos;d love to
              <br />
              <em>hear from you.</em>
            </h1>
            <p>
              Planning a celebration? Tell us what you have in mind and our team
              will help bring your perfect menu to life.
            </p>
          </div>
          <div className="hero-food-mark" aria-hidden="true">
            🍽️
          </div>
        </section>

        <section className="contact-layout">
          <aside className="contact-info">
            <span className="section-label">Get in touch</span>
            <h2>
              Let&apos;s talk
              <br />
              <em>about your event.</em>
            </h2>
            <p className="info-intro">
              Whether it&apos;s an intimate gathering or a grand celebration,
              we&apos;re here to make every detail delicious.
            </p>

            <div className="info-list">
              <a
                className="info-box"
                href="https://maps.google.com/?q=Sangli,Maharashtra,India"
                target="_blank"
                rel="noreferrer"
              >
                <span className="info-icon">
                  <ContactIcon>
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </ContactIcon>
                </span>
                <span>
                  <small>Visit us</small>
                  <strong>Sangli, Maharashtra, India</strong>
                </span>
                <b>↗</b>
              </a>
              <a className="info-box" href="tel:+919876543210">
                <span className="info-icon">
                  <ContactIcon>
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
                  </ContactIcon>
                </span>
                <span>
                  <small>Call us</small>
                  <strong>+91 98765 43210</strong>
                </span>
                <b>↗</b>
              </a>
              <a className="info-box" href="mailto:joshiscatering@gmail.com">
                <span className="info-icon">
                  <ContactIcon>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </ContactIcon>
                </span>
                <span>
                  <small>Email us</small>
                  <strong>joshiscatering@gmail.com</strong>
                </span>
                <b>↗</b>
              </a>
            </div>

            <div className="response-note">
              <span>✦</span>
              <p>
                <strong>Quick response guaranteed</strong>
                <small>We usually reply within one business day.</small>
              </p>
            </div>
          </aside>

          <section className="contact-form-card">
            <div className="form-heading">
              <div>
                <span className="section-label">Start a conversation</span>
                <h2>Send us a message</h2>
                <p>
                  Share a few details and we&apos;ll get back to you shortly.
                </p>
              </div>
              <span className="form-number">01</span>
            </div>
            {status.message && (
              <div className={`form-status ${status.type}`} role="status">
                {status.type === "success" ? "✓" : "!"} {status.message}
              </div>
            )}
            {contactId && (
              <div className="reply-check-box">
                <strong>Message ID: {contactId}</strong>
                <button
                  type="button"
                  onClick={checkAdminReply}
                  disabled={checkingReply}
                >
                  {checkingReply ? "Checking..." : "Check admin reply"}
                </button>
                {adminReply && <p>{adminReply}</p>}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  <span>Your name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={updateField}
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={updateField}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
              <label>
                <span>Phone number</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={updateField}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  autoComplete="tel"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
              </label>
              <label>
                <span>Tell us about your event</span>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Event date, guest count, occasion, and anything else we should know..."
                  value={formData.message}
                  onChange={updateField}
                  required
                />
              </label>
              <button
                className="send-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send enquiry"}
                <span>→</span>
              </button>
              <p className="form-footnote">
                By sending this form, you&apos;re taking the first step towards
                a memorable celebration.
              </p>
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Contact;
