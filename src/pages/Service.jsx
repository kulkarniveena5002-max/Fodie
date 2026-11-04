import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const services = [
  {
    icon: "💍",
    title: "Wedding Catering",
    text: "Elegant menus and exceptional service to make your special day memorable.",
  },
  {
    icon: "💼",
    title: "Corporate Events",
    text: "Professional catering solutions for meetings, conferences, and office parties.",
  },
  {
    icon: "🎂",
    title: "Birthday Parties",
    text: "Customized menus and delicious dishes for birthdays and celebrations.",
  },
  {
    icon: "🌿",
    title: "Outdoor Catering",
    text: "Complete food and event catering services for outdoor gatherings.",
  },
  {
    icon: "🪔",
    title: "Festival Catering",
    text: "Traditional and modern cuisine options for festivals and family functions.",
  },
  {
    icon: "🍽️",
    title: "Customized Menus",
    text: "Personalized menu planning based on your preferences and budget.",
  },
];

function Services() {
  const [serviceItems, setServiceItems] = useState(services);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/services");
        const adminServices = Array.isArray(response.data) ? response.data : [];

        if (adminServices.length > 0) {
          setServiceItems(
            adminServices.map((service) => ({
              icon: service.icon || "🍽️",
              title: service.title || service.name || "Catering service",
              text:
                service.description ||
                service.text ||
                "Professional catering for your special occasion.",
              image: service.image_url || service.image || "",
            })),
          );
        }
      } catch (error) {
        console.error("Could not load admin services:", error);
      }
    };

    loadServices();
  }, []);

  return (
    <>
      <style>{`
        .services {
          --service-purple: rebeccapurple;
          --service-deep: #32164d;
          --service-cream: #fffaf4;
          --service-muted: #85788d;
          min-height: calc(100vh - 80px);
          padding: 78px 7% 95px;
          color: #2a2030;
          background:
            radial-gradient(circle at 8% 10%, rgba(102, 51, 153, .09), transparent 24%),
            linear-gradient(135deg, #fffaf4 0%, #f8f0fa 100%);
          font-family: "DM Sans", Arial, sans-serif;
        }

        .services,
        .services * {
          box-sizing: border-box;
        }

        .services-header {
          width: min(680px, 100%);
          margin: 0 auto 52px;
          text-align: center;
        }

        .services-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          color: var(--service-purple);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .services-kicker::before,
        .services-kicker::after {
          width: 25px;
          height: 1px;
          content: "";
          background: #c6a9d3;
        }

        .services h2 {
          margin: 0;
          color: var(--service-deep);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1.05;
          letter-spacing: -1.5px;
        }

        .services h2 em {
          color: var(--service-purple);
          font-style: normal;
        }

        .services-subtitle {
          max-width: 520px;
          margin: 18px auto 0;
          color: var(--service-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .services-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .service-card {
          position: relative;
          min-height: 220px;
          overflow: hidden;
          padding: 29px 26px 25px;
          border: 1px solid #eee3f0;
          border-radius: 18px;
          background: rgba(255, 255, 255, .84);
          box-shadow: 0 10px 25px rgba(50, 22, 77, .055);
          transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
        }

        .service-card::after {
          position: absolute;
          right: -35px;
          bottom: -55px;
          width: 130px;
          height: 130px;
          content: "";
          border: 1px solid rgba(102, 51, 153, .1);
          border-radius: 50%;
        }

        .service-image {
          display: block;
          width: calc(100% + 52px);
          height: 125px;
          margin: -29px -26px 22px;
          object-fit: cover;
        }

        .service-card:hover {
          border-color: #c9a9d8;
          box-shadow: 0 18px 35px rgba(50, 22, 77, .12);
          transform: translateY(-7px);
        }

        .service-icon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          margin-bottom: 23px;
          border: 1px solid #eadcf0;
          border-radius: 15px;
          background: #f4eafa;
          font-size: 25px;
          transition: transform .25s ease, background .25s ease;
        }

        .service-card:hover .service-icon {
          background: #eadcf4;
          transform: rotate(-5deg) scale(1.08);
        }

        .service-card h3 {
          margin: 0 0 10px;
          color: var(--service-deep);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
        }

        .service-card p {
          max-width: 280px;
          margin: 0;
          color: var(--service-muted);
          font-size: 12px;
          line-height: 1.75;
        }

        .service-number {
          position: absolute;
          top: 25px;
          right: 25px;
          color: #d8c7df;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
        }

        @media (max-width: 900px) {
          .services {
            padding-right: 5%;
            padding-left: 5%;
          }

          .services-container {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .services {
            min-height: calc(100vh - 65px);
            padding: 50px 6% 65px;
          }

          .services-header {
            margin-bottom: 35px;
          }

          .services h2 {
            font-size: 40px;
          }

          .services-subtitle {
            font-size: 12px;
          }

          .services-container {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .service-card {
            min-height: auto;
            padding: 23px 21px;
          }

          .service-icon {
            width: 46px;
            height: 46px;
            margin-bottom: 17px;
          }
        }
      `}</style>

      <Header />

      <section className="services" id="services">
        <div className="services-header">
          <span className="services-kicker">Made for your moments</span>
          <h2>
            Our <em>Services</em>
          </h2>
          <p className="services-subtitle">
            From intimate gatherings to grand celebrations, we bring delicious
            food and thoughtful service to every occasion.
          </p>
        </div>

        <div className="services-container">
          {serviceItems.map((service, index) => (
            <article className="service-card" key={service.title}>
              {service.image && (
                <img
                  className="service-image"
                  src={service.image}
                  alt={service.title}
                />
              )}
              <span className="service-number">0{index + 1}</span>
              <div className="service-icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Services;
