import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Menu.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const menuSections = [
  {
    icon: "🥗",
    image: "/menu-images/starters.webp",
    title: "Starters",
    note: "Small plates, big flavour",
    items: [
     
    ],
  },
  {
    icon: "🍛",
    image: "/menu-images/main-course.jpg",
    title: "Main Course",
    note: "Comforting vegetarian classics",
    items: [
      "Paneer Butter Masala",
      "Veg Kolhapuri",
      "Malai Kofta",
      "Mix Veg Curry",
    ],
  },
  {
    icon: "🍞",
    image: "/menu-images/breads.jpg",
    title: "Indian Breads",
    note: "Fresh from the tandoor",
    items: ["Butter Naan", "Tandoori Roti", "Stuffed Kulcha", "Paratha"],
  },
  {
    icon: "🍚",
    image: "/menu-images/rice.jpg",
    title: "Rice Specialities",
    note: "Aromatic rice favourites",
    items: ["Veg Biryani", "Jeera Rice", "Veg Pulao", "Steamed Rice"],
  },
  {
    icon: "🍨",
    image: "/menu-images/desserts.jpg",
    title: "Desserts",
    note: "A sweet ending",
    items: ["Gulab Jamun", "Rasgulla", "Fruit Custard", "Ice Cream"],
  },
  
  {
    icon: "🥤",
    image: "/menu-images/beverages.jpg",
    title: "Beverages",
    note: "Cool, fresh and refreshing",
    items: [
      "Mango Shake",
      "Fresh Lime Juice",
      "Masala Buttermilk",
      "Cold Coffee",
    ],
  },
];

const LeafIcon = () => (
  <span className="leaf-icon" aria-hidden="true">
    ✦
  </span>
);

const categoryMap = {
  Starters: "Starters",
  "Main Course": "Main Course",
  Breads: "Indian Breads",
  Desserts: "Desserts",
  Beverages: "Beverages",
};

const getCategoryTitle = (category) => {
  const cleanCategory = String(category || "").trim();
  const matchedKey = Object.keys(categoryMap).find(
    (key) => key.toLowerCase() === cleanCategory.toLowerCase(),
  );
  return categoryMap[matchedKey] || cleanCategory;
};

function Menu() {
  const navigate = useNavigate();
  const [sections, setSections] = useState(menuSections);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    const loadAdminMenus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/menu");
        const adminMenus = Array.isArray(response.data) ? response.data : [];

        setSections((currentSections) => {
          const mergedSections = currentSections.map((section) => ({
            ...section,
            items: [...section.items],
          }));

          adminMenus.forEach((menu) => {
            const sectionTitle = getCategoryTitle(menu.category);
            if (!sectionTitle || !menu.name) return;

            let section = mergedSections.find(
              (item) => item.title === sectionTitle,
            );
            if (!section) {
              section = {
                icon: "🍽️",
                image: "/menu-images/main-course.jpg",
                title: sectionTitle,
                note: "Freshly added to our menu",
                items: [],
              };
              mergedSections.push(section);
            }

            const itemLabel = menu.price
              ? `${menu.name} — ₹${menu.price}`
              : menu.name;

            if (menu.image && !section.adminImageSet) {
              section.image = menu.image;
              section.adminImageSet = true;
            }

            if (!section.items.some((item) => item.startsWith(menu.name))) {
              section.items.push(itemLabel);
            }
          });

          return mergedSections;
        });
      } catch (error) {
        console.error("Could not load admin menu items:", error);
      } finally {
        setMenuLoading(false);
      }
    };

    loadAdminMenus();
  }, []);

  return (
    <>
      <Header />
      <main className="menu-page">
        <section className="menu-hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="menu-hero-content">
            <span className="menu-kicker">
              <LeafIcon /> 100% pure vegetarian
            </span>
            <h1>
              Good food.
              <br />
              <em>Good mood.</em>
            </h1>
            <p>
              Fresh ingredients, timeless recipes and a whole lot of love on
              every plate.
            </p>
            <div className="hero-details">
              <span>✦ Freshly prepared</span>
              <span>✦ Family favourites</span>
              <span>✦ Made with love</span>
            </div>
          </div>
          <div className="hero-bowl" aria-hidden="true">
            <span>🥗</span>
          </div>
        </section>

        <section className="menu-content">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">Explore our flavours</span>
              <h2>Our vegetarian menu</h2>
            </div>
            <p>
              From comforting classics to delicious new favourites,
              <br />
              there is something for everyone.
            </p>
          </div>
          {menuLoading && (
            <p className="menu-loading">Refreshing today&apos;s menu...</p>
          )}
          <div className="menu-container">
            {sections.map((section, index) => (
              <article
                className={`menu-card menu-card-${index + 1}`}
                key={section.title}
              >
                <div className="card-image-wrap">
                  <img
                    src={section.image}
                    alt={`${section.title} vegetarian dishes`}
                  />
                  <div className="image-shade" />
                  <span className="image-label">
                    {section.icon} {section.title}
                  </span>
                  <span className="veg-badge">
                    <LeafIcon /> Veg
                  </span>
                </div>
                <div className="card-body">
                  <h3>{section.title}</h3>
                  <p className="card-note">{section.note}</p>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>
                        <span className="item-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate("/Order")}
                    className="order-button"
                  >
                    Order from this section <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="menu-bottom-cta">
            <div>
              <span className="section-eyebrow">
                Ready to taste the difference?
              </span>
              <h2>Let’s make your meal memorable.</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/Order")}
              className="cta-button"
            >
              Place an order <span>→</span>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default Menu;
