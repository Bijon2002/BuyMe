import React from 'react';

const announcements = [
  { text: "Orders Over $50", icon: "fas fa-truck" },
  { text: "New Arrivals Every Week", icon: "fas fa-gift" },
  { text: "Premium Quality Guaranteed", icon: "fas fa-star" },
  { text: "Exclusive Deals for Members", icon: "fas fa-gem" },
];

export default function MarqueeBanner() {
  const items = [...announcements, ...announcements];

  return (
    <div className="marquee-banner">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            <i className={item.icon} style={{ marginRight: '0.85rem', fontSize: '1.05rem', color: 'var(--primary)', opacity: 0.9 }}></i>
            {item.text}
            <span className="marquee-divider">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
