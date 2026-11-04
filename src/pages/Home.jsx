import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";
import Header from "../components/Header";


const FeatureIcon = ({ type }) => {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h6" /></>,
    leaf: <><path d="M20 4C10 4 4 8 4 15c0 3 2 5 5 5 7 0 11-6 11-16Z" /><path d="M4 20c2-5 6-8 11-10" /></>,
    chef: <><path d="M6 20h12M8 20v-3h8v3M6 17h12M8 14h8" /><path d="M9 14V9a3 3 0 0 1 6 0v5M7 9a3 3 0 1 1 3-3M17 9a3 3 0 1 0-3-3" /></>,
  };
  return <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
};

const eventTypes = [
  { icon: "💍", label: "Weddings", text: "Grand celebrations" },
  { icon: "🎂", label: "Birthdays", text: "Moments to remember" },
  { icon: "🏢", label: "Corporate", text: "Professional gatherings" },
  { icon: "👨‍👩‍👧", label: "Family events", text: "Made with love" },
];

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
       <section
  className="home-hero"
  style={{
    "--hero-image":
      "url('https://images.unsplash.com/photo-1555244162-803834f70033?w=1600')",
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-pattern"></div>
  <div className="home-hero-content">
            <span className="home-kicker"><span className="kicker-line" /> Pure vegetarian catering</span>
            <h1>Delicious moments,<br /><em>beautifully served.</em></h1>
            <p>From intimate family gatherings to grand celebrations, we bring the warmth of homemade flavours to every occasion.</p>
            <div className="hero-actions"><Link to="/Order" className="primary-home-btn">Plan your event <span>→</span></Link><Link to="/Menu" className="secondary-home-btn">Explore our menu <span>↗</span></Link></div>
            <div className="hero-trust"><span className="trust-avatars"><i>J</i><i>R</i><i>S</i></span><span><strong>Loved by 500+ families</strong><small>Fresh food. Happy guests.</small></span></div>
          </div>
          <div className="hero-stamp"><span>100%</span><small>Pure veg</small><b>✦</b></div>
        </section>

        <section className="event-strip"><div className="event-strip-intro"><span className="section-eyebrow">Made for every moment</span><h2>Tell us the occasion,<br /><em>we’ll serve the joy.</em></h2></div>{eventTypes.map((event) => <div className="event-item" key={event.label}><span className="event-icon">{event.icon}</span><div><strong>{event.label}</strong><small>{event.text}</small></div></div>)}</section>

        <section className="home-features"><span className="section-eyebrow">Why choose Joshi’s?</span><h2>Good food is our<br /><em>love language.</em></h2><div className="features-grid"><article><div className="feature-icon-wrap"><FeatureIcon type="leaf" /></div><h3>Fresh & vegetarian</h3><p>Seasonal ingredients and family recipes come together in every delicious dish.</p></article><article><div className="feature-icon-wrap"><FeatureIcon type="chef" /></div><h3>Made with care</h3><p>Our experienced kitchen team prepares each menu fresh for your special day.</p></article><article><div className="feature-icon-wrap"><FeatureIcon type="calendar" /></div><h3>Seamless planning</h3><p>From menu selection to final serving, we make your event feel effortless.</p></article></div></section>
      </main>
    </div>
  );
}
