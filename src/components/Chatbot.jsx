import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Chatbot.css";

const welcomeMessage = {
  role: "assistant",
  content:
    "Namaste! I’m Fodie Assistant. I can help with menus, services, orders and event planning.",
};

function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.data?.reply || "Please contact our team for help.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I’m having trouble connecting right now. Please call us or use the Contact page.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <section className="chatbot-panel" aria-label="Fodie AI Assistant">
          <header className="chatbot-header">
            <div className="chatbot-avatar">✦</div>
            <div>
              <strong>Fodie Assistant</strong>
              <span>
                <i /> Online catering help
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}
            {sending && (
              <div className="chat-message assistant typing">Thinking...</div>
            )}
          </div>

          <div className="chatbot-actions" aria-label="Quick navigation">
            <button type="button" onClick={() => navigate("/Menu")}>
              View menu
            </button>
            <button type="button" onClick={() => navigate("/Service")}>
              Our services
            </button>
            <button type="button" onClick={() => navigate("/Order")}>
              Place an order
            </button>
            <button type="button" onClick={() => navigate("/contact")}>
              Contact team
            </button>
          </div>

          <form className="chatbot-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about menu or orders..."
              aria-label="Ask Fodie Assistant"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              ➜
            </button>
          </form>
        </section>
      )}

      <button
        className="chatbot-launcher"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open Fodie AI Assistant"
      >
        <span>{open ? "×" : "✦"}</span>
        {!open && <b>Ask Fodie AI</b>}
      </button>
    </div>
  );
}

export default Chatbot;
