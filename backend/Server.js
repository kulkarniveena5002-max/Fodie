require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let OpenAI;
try {
  OpenAI = require("openai");
} catch (_error) {
  OpenAI = null;
}

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9]/gi, "-");
    callback(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) callback(null, true);
    else callback(new Error("Only image files are allowed."));
  },
});

app.use("/uploads", express.static(uploadDirectory));

mailer.verify((error) => {
  if (error) console.error("MAIL ERROR:", error.message);
  else console.log("MAIL SERVER READY");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "India$1950",
  database: "fodie_db",
});

db.connect((error) => {
  if (error) console.error("Database Connection Failed:", error);
  else console.log("Connected to MySQL Database");
});

const imageUrl = (file, url) => {
  if (file) return `http://localhost:${PORT}/uploads/${file.filename}`;
  return url || "";
};

const openai =
  OpenAI && process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const fallbackChatReply = (message) => {
  const text = String(message || "").toLowerCase();
  if (text.includes("order") || text.includes("book"))
    return "You can place an order from the Order page. After submitting, save your Order ID to track Pending, Confirmed or Completed status.";
  if (text.includes("wedding"))
    return "Wedding Catering is available with elegant menus and exceptional service for your special day. Visit Services or Contact us to plan it.";
  if (text.includes("corporate"))
    return "Corporate Events catering is available for meetings, conferences and office parties. Visit Services or Contact us for planning.";
  if (text.includes("birthday"))
    return "Birthday Party catering is available with customized menus and delicious dishes for celebrations.";
  if (text.includes("outdoor"))
    return "Outdoor Catering is available for outdoor gatherings. Contact our team to discuss the venue and menu.";
  if (text.includes("festival"))
    return "Festival Catering is available with traditional and modern cuisine options for family functions.";
  if (text.includes("custom") || text.includes("personalized"))
    return "Customized Menus are available based on your preferences and budget. Contact our team to plan your menu.";
  if (text.includes("service") || text.includes("catering"))
    return "We provide wedding, birthday, corporate, outdoor and customized catering services. Please visit our Services page for details.";
  if (text.includes("menu") || text.includes("food") || text.includes("price"))
    return "Please visit our Menu page for vegetarian dishes and prices. I can also help you choose items for your event.";
  if (text.includes("contact") || text.includes("phone"))
    return "You can contact our team through the Contact page or call +91 98765 43210.";
  return "Thank you for your question. That service is not currently listed on our website, so I do not want to provide inaccurate information. Please visit our Menu or Services section, or contact our team for a customized request.";
};

const publicServiceCatalog = [
  {
    title: "Wedding Catering",
    description:
      "Elegant menus and exceptional service for weddings and special days.",
  },
  {
    title: "Corporate Events",
    description:
      "Professional catering for meetings, conferences and office parties.",
  },
  {
    title: "Birthday Parties",
    description:
      "Customized menus and delicious dishes for birthdays and celebrations.",
  },
  {
    title: "Outdoor Catering",
    description: "Complete food and event catering for outdoor gatherings.",
  },
  {
    title: "Festival Catering",
    description:
      "Traditional and modern cuisine for festivals and family functions.",
  },
  {
    title: "Customized Menus",
    description: "Personalized menu planning based on preferences and budget.",
  },
];

const knownServiceReply = (message) => {
  const text = String(message || "").toLowerCase();
  const service = publicServiceCatalog.find((item) =>
    item.title
      .toLowerCase()
      .split(" ")
      .some(
        (keyword) =>
          keyword.length > 4 &&
          !["catering", "events", "parties", "menus"].includes(keyword) &&
          text.includes(keyword),
      ),
  );
  if (!service) return "";
  return `${service.title} is available. ${service.description} Please visit the Services page or Contact us to plan it.`;
};

const greetingReply = (message) => {
  const text = String(message || "")
    .trim()
    .toLowerCase();
  if (
    /^(hi|hello|hey|namaste|hii|good morning|good afternoon|good evening)[!.? ]*$/.test(
      text,
    )
  ) {
    return "Namaste! Welcome to Fodie Catering. I can help you explore our menu, services, event orders or order status. What would you like to know?";
  }
  return "";
};

app.get("/", (_req, res) => res.send("Server Running Successfully"));

// ---------- AI Catering Assistant ----------
app.post("/chat", async (req, res) => {
  const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
  const latestMessage =
    messages.filter((item) => item.role === "user").pop()?.content || "";
  const greeting = greetingReply(latestMessage);

  if (greeting)
    return res.json({ success: true, reply: greeting, mode: "greeting" });

  const knownReply = knownServiceReply(latestMessage);

  if (knownReply)
    return res.json({
      success: true,
      reply: knownReply,
      mode: "website-catalog",
    });

  if (!openai)
    return res.json({
      success: true,
      reply: fallbackChatReply(latestMessage),
      mode: "fallback",
    });

  try {
    const [menuRows] = await db
      .promise()
      .query(
        "SELECT name, category, price, description FROM menus ORDER BY id DESC LIMIT 40",
      );
    const [serviceRows] = await db
      .promise()
      .query(
        "SELECT title, description FROM services ORDER BY id DESC LIMIT 20",
      );
    const allServices = [...publicServiceCatalog, ...serviceRows].filter(
      (service, index, list) =>
        index ===
        list.findIndex(
          (item) => item.title.toLowerCase() === service.title.toLowerCase(),
        ),
    );
    const context = `Menus: ${JSON.stringify(menuRows)}\nServices: ${JSON.stringify(allServices)}`;
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are Fodie Assistant for a vegetarian catering business in India. Be concise, warm and professional. Only make claims supported by the website context. If a customer asks for a product, service, feature or promise that is not supported by the website context, clearly say that it is not currently listed and politely guide them to the Menu, Services or Contact page. Never invent prices, availability, delivery promises or policies. For order-specific questions, ask the user for their Order ID. Website context:\n${context}`,
        },
        ...messages.slice(-10),
      ],
    });
    res.json({
      success: true,
      reply:
        completion.choices[0]?.message?.content ||
        fallbackChatReply(latestMessage),
    });
  } catch (error) {
    console.error("AI chat error:", error);
    res.json({
      success: true,
      reply: fallbackChatReply(latestMessage),
      mode: "fallback",
    });
  }
});

// ---------- Contact API ----------
app.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message], (error, result) => {
    if (error)
      return res.status(500).json({ success: false, error: error.message });
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Contact saved successfully",
    });
  });
});

app.get("/contact", (_req, res) => {
  db.query("SELECT * FROM contacts ORDER BY id DESC", (error, result) => {
    if (error)
      return res.status(500).json({ success: false, error: error.message });
    res.json(result);
  });
});

app.get("/contact/:id/", (req, res) => {
  db.query(
    "SELECT * FROM contacts WHERE id = ?",
    [req.params.id],
    (error, rows) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!rows.length)
        return res
          .status(404)
          .json({ success: false, error: "Message not found" });
      res.json(rows[0]);
    },
  );
});

app.patch("/contact/:id/reply", (req, res) => {
  const contactId = req.params.id;
  const reply = String(req.body.reply || "").trim();

  if (!reply) {
    return res.status(400).json({
      success: false,
      error: "Reply is required",
    });
  }

  db.query(
    "SELECT name, email FROM contacts WHERE id = ? LIMIT 1",
    [contactId],
    (findError, rows) => {
      if (findError) {
        return res.status(500).json({ success: false, error: findError.message });
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          error: "Message not found",
        });
      }

      const customer = rows[0];
      if (!customer.email) {
        return res.status(400).json({
          success: false,
          error: "Customer email is missing",
        });
      }

      mailer.sendMail(
        {
          from: `Joshi's Catering <${process.env.MAIL_USER}>`,
          to: customer.email,
          subject: "Reply from Joshi's Catering",
          text: `Hello ${customer.name || "Customer"},\n\n${reply}\n\nRegards,\nJoshi's Catering`,
          html: `<p>Hello ${customer.name || "Customer"},</p><p>${reply.replace(/\n/g, "<br />")}</p><p>Regards,<br />Joshi's Catering</p>`,
        },
        (mailError) => {
          if (mailError) {
            console.error("EMAIL ERROR:", mailError.message);
            return res.status(502).json({
              success: false,
              error: `Email could not be sent: ${mailError.message}`,
            });
          }

          db.query(
            "UPDATE contacts SET admin_reply = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?",
            [reply, contactId],
            (updateError) => {
              if (updateError) {
                return res.status(500).json({
                  success: false,
                  error: updateError.message,
                });
              }

              return res.json({
                success: true,
                reply,
                emailSent: true,
                message: "Reply sent to customer email",
              });
            },
          );
        },
      );
    },
  );
});

app.delete("/contact/:id", (req, res) => {
  db.query(
    "DELETE FROM contacts WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Contact not found" });
      res.json({ success: true, message: "Contact deleted successfully" });
    },
  );
});

// ---------- Menu API ----------
app.get("/menu", (_req, res) => {
  db.query(
    "SELECT id, name, category, price, description, image_url, created_at FROM menus ORDER BY id DESC",
    (error, rows) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      res.json(rows.map((item) => ({ ...item, image: item.image_url })));
    },
  );
});

app.post("/menu", upload.single("imageFile"), (req, res) => {
  const { name, category, price, description, image } = req.body;
  const imageUrlValue = imageUrl(req.file, image);
  const sql =
    "INSERT INTO menus (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, category, Number(price), description, imageUrlValue],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      res.status(201).json({
        success: true,
        id: result.insertId,
        name,
        category,
        price: Number(price),
        description,
        image: imageUrlValue,
      });
    },
  );
});

app.put("/menu/:id", upload.single("imageFile"), (req, res) => {
  const { name, category, price, description, image } = req.body;
  const imageUrlValue = imageUrl(req.file, image);
  const sql = `UPDATE menus
    SET name = ?, category = ?, price = ?, description = ?,
        image_url = COALESCE(NULLIF(?, ''), image_url)
    WHERE id = ?`;

  db.query(
    sql,
    [name, category, Number(price), description, imageUrlValue, req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Menu item not found" });
      db.query(
        "SELECT id, name, category, price, description, image_url, created_at FROM menus WHERE id = ?",
        [req.params.id],
        (selectError, rows) => {
          if (selectError)
            return res
              .status(500)
              .json({ success: false, error: selectError.message });
          res.json({ ...rows[0], image: rows[0].image_url });
        },
      );
    },
  );
});

app.delete("/menu/:id", (req, res) => {
  db.query(
    "DELETE FROM menus WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Menu item not found" });
      res.json({ success: true, message: "Menu item deleted successfully" });
    },
  );
});

// ---------- Services API ----------
app.get("/services", (_req, res) => {
  db.query(
    "SELECT id, title, description, image_url, created_at FROM services ORDER BY id DESC",
    (error, rows) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      res.json(rows.map((item) => ({ ...item, image: item.image_url })));
    },
  );
});

app.post("/services", upload.single("imageFile"), (req, res) => {
  const { title, description, icon, image } = req.body;
  const imageUrlValue = imageUrl(req.file, image);
  const sql =
    "INSERT INTO services (title, description, image_url) VALUES (?, ?, ?)";

  db.query(sql, [title, description, imageUrlValue], (error, result) => {
    if (error)
      return res.status(500).json({ success: false, error: error.message });
    res.status(201).json({
      success: true,
      id: result.insertId,
      title,
      description,
      icon: icon || "🍽️",
      image: imageUrlValue,
    });
  });
});

app.put("/services/:id", upload.single("imageFile"), (req, res) => {
  const { title, description, image } = req.body;
  const imageUrlValue = imageUrl(req.file, image);
  const sql = `UPDATE services
    SET title = ?, description = ?, image_url = COALESCE(NULLIF(?, ''), image_url)
    WHERE id = ?`;

  db.query(
    sql,
    [title, description, imageUrlValue, req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Service not found" });
      db.query(
        "SELECT id, title, description, image_url, created_at FROM services WHERE id = ?",
        [req.params.id],
        (selectError, rows) => {
          if (selectError)
            return res
              .status(500)
              .json({ success: false, error: selectError.message });
          res.json({ ...rows[0], image: rows[0].image_url });
        },
      );
    },
  );
});

app.delete("/services/:id", (req, res) => {
  db.query(
    "DELETE FROM services WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Service not found" });
      res.json({ success: true, message: "Service deleted successfully" });
    },
  );
});

// ---------- Orders API ----------
app.post("/orders", (req, res) => {
  const {
    name,
    phone,
    email,
    eventType,
    eventDate,
    guests,
    menuPackage,
    item,
    quantity,
    address,
    requirements,
  } = req.body;

  const sql = `
    INSERT INTO orders
    (name, phone, email, eventType, eventDate, guests, menuPackage, item, quantity, address, requirements, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  const values = [
    name,
    phone,
    email,
    eventType,
    eventDate,
    guests,
    menuPackage,
    item,
    quantity,
    address,
    requirements,
  ];

  db.query(sql, values, (error, result) => {
    if (error)
      return res.status(500).json({ success: false, error: error.message });
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Order saved successfully",
      status: "Pending",
    });
  });
});

app.get("/orders", (_req, res) => {
  db.query("SELECT * FROM orders", (error, rows) => {
    if (error)
      return res.status(500).json({ success: false, error: error.message });
    res.json(rows);
  });
});

app.get("/orders/:id/status", (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE id = ?",
    [req.params.id],
    (error, rows) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!rows.length)
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      res.json(rows[0]);
    },
  );
});

app.patch("/orders/:id/status", (req, res) => {
  const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid order status" });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      res.json({ success: true, status });
    },
  );
});

app.delete("/orders/:id", (req, res) => {
  db.query(
    "DELETE FROM orders WHERE id = ?",
    [req.params.id],
    (error, result) => {
      if (error)
        return res.status(500).json({ success: false, error: error.message });
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      res.json({ success: true, message: "Order deleted successfully" });
    },
  );
});

app.use((error, _req, res, _next) => {
  console.error("Server error:", error);
  res
    .status(400)
    .json({ success: false, error: error.message || "Request failed" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
