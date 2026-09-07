"use client";

import { useEffect, useState } from "react";

type Deal = {
  restaurant: string;
  title: string;
  price: string;
  detail: string;
  badges: string[];
  source: string;
  sourceLabel: string;
  days?: number[];
  validFrom?: string;
  validUntil?: string;
};

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

const deals: Deal[] = [
  { restaurant: "Domino's · Store 10285", title: "Mix & match — 2 or more", price: "$8.99 ea.", detail: "Medium 2-topping pizza, pasta, chicken, select breads, desserts and more. Coupon 893WS; extras may cost more.", badges: ["PUBLIC", "LOCAL STORE", "2+ ITEMS"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons", days: EVERY_DAY },
  { restaurant: "Domino's · Store 10285", title: "Large 4-topping pizza", price: "$16.99", detail: "Coupon 4201 at the 2555 Erin Centre Blvd store. The location-specific coupon page currently lists this offer.", badges: ["PUBLIC", "LOCAL STORE", "COUPON 4201"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons", days: EVERY_DAY },
  { restaurant: "Domino's · Store 10285", title: "Build-your-own pizzas", price: "40% off", detail: "Monday-only coupon 8642. The dashboard will show this card automatically on Mondays.", badges: ["PUBLIC", "MONDAY ONLY", "COUPON 8642"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons", days: [1] },
  { restaurant: "Turtle Jack's · Erin Mills", title: "Daily Happy Hour", price: "$5–$16", detail: "Today from 2–5 pm and 8 pm–close. Includes $6 sweet potato fries, $15 classic burger and $7 draught.", badges: ["TODAY", "PUBLIC", "TIME LIMITED"], source: "https://turtlejacks.com/happy-hour/", sourceLabel: "Turtle Jack's Happy Hour", days: EVERY_DAY },
  { restaurant: "Turtle Jack's · Erin Mills", title: "Monday wings & beer", price: "$13.99", detail: "One pound of wings for $13.99; 18 oz Molson Canadian or Coors Light is $6. Available Mondays at participating locations—confirm Erin Mills participation.", badges: ["MONDAY ONLY", "PUBLIC", "PARTICIPATION VARIES"], source: "https://turtlejacks.com/features_specials/monday-wings-beer/", sourceLabel: "Turtle Jack's Monday special", days: [1] },
  { restaurant: "KFC · Erin Mills Town Centre", title: "Big Crunch sandwich", price: "$5.95", detail: "Monday's Sandwich of the Day, regular or spicy. Select the Erin Mills Town Centre store to confirm local pricing and availability before ordering.", badges: ["MONDAY ONLY", "PUBLIC", "CHECK LOCATION"], source: "https://www.kfc.ca/menu/limited-time-offers/5-big-crunch-sandwich-monday", sourceLabel: "KFC Monday offer", days: [1] },
  { restaurant: "Subway", title: "Five classic Footlongs", price: "Under $10", detail: "Tuna, ham, turkey breast, Veggie Delite, or Cold Cut Combo. Limited-time public offer; participation may vary.", badges: ["PUBLIC", "LIMITED TIME", "UNDER $10"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers", days: EVERY_DAY },
  { restaurant: "Subway", title: "Any Power Bowl", price: "20% off", detail: "Use code 20OFFBOWL when ordering. The offer is currently displayed on Subway Canada's public homepage.", badges: ["PUBLIC", "CODE REQUIRED", "ONLINE"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers", days: EVERY_DAY },
  { restaurant: "Subway", title: "Buy 2 Footlongs, get a 3rd free", price: "3rd free", detail: "Buy any two Footlong subs and use code 3SUBS to receive another Footlong free. Participation may vary.", badges: ["PUBLIC", "CODE REQUIRED", "3 ITEMS"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers", days: EVERY_DAY },
  { restaurant: "New York Fries", title: "CAA member discount", price: "10% off", detail: "Present a valid CAA membership before ordering. Participating locations; cannot be combined with another offer.", badges: ["MEMBERSHIP", "PUBLIC TERMS"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions", days: EVERY_DAY },
  { restaurant: "New York Fries", title: "Mix-and-match points boost", price: "3× points", detail: "Fry Society members earn triple points when buying any two fries, any two poutines, or one of each in the same transaction. Participating locations; first transaction of the day only.", badges: ["MEMBERSHIP", "ENDS SEP 13", "BUY 2"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions", days: EVERY_DAY, validFrom: "2026-09-01", validUntil: "2026-09-13" },
  { restaurant: "New York Fries", title: "Ultimate Combo on DoorDash", price: "40% off", detail: "Order an Ultimate Combo through the DoorDash app. Fees, taxes and gratuity still apply; participating locations and availability may vary.", badges: ["DOORDASH APP", "ENDS SEP 13", "DELIVERY"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions", days: EVERY_DAY, validFrom: "2026-08-31", validUntil: "2026-09-13" },
];

const uncertain = [
  { name: "Hero Certified Burgers", state: "Schedule unclear", text: "Seven Daily Deal items and prices are public, but the page does not map them to weekdays." },
  { name: "Thai Express", state: "Partially observable", text: "The Erin Mills outlet advertises daily specials, but today's item and price are not exposed." },
  { name: "Pizza Pizza", state: "Checkout required", text: "The specials page now gates current products and local pricing behind address selection, so the earlier $16.25 price is not confirmed." },
  { name: "Sultan Ahmet", state: "Time unclear", text: "The lunch-special menu and prices are public, but its eligible days and hours are not clearly stated online." },
  { name: "Firehouse Subs", state: "Event conditional", text: "A weekend MLB game must go to extra innings first; if triggered, code EXTRA gives a BOGO medium sub online or in the app Monday through Wednesday." },
];

const appOnly = ["A&W", "Tim Hortons", "Taco Bell", "Freshii", "Poulet Rouge"];

type TorontoDay = { dateKey: string; dayIndex: number; label: string };

function getTorontoDay(date = new Date()): TorontoDay {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = value("weekday");
  const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(weekday);
  return {
    dateKey: `${value("year")}-${value("month")}-${value("day")}`,
    dayIndex,
    label: `${weekday} · ${new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", month: "long", day: "numeric", year: "numeric" }).format(date)}`,
  };
}

function isActive(deal: Deal, today: TorontoDay) {
  return (!deal.days || deal.days.includes(today.dayIndex))
    && (!deal.validFrom || today.dateKey >= deal.validFrom)
    && (!deal.validUntil || today.dateKey <= deal.validUntil);
}

export default function Home() {
  const [today, setToday] = useState<TorontoDay>(() => getTorontoDay());

  useEffect(() => {
    const refreshDate = () => setToday(getTorontoDay());
    refreshDate();
    const timer = window.setInterval(refreshDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeDeals = deals.filter((deal) => isActive(deal, today));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Erin Mills Deals home"><span className="brand-mark">EM</span><span>Erin Mills Deals</span></a>
        <p>Within roughly 1 km of Erin Mills Town Centre</p>
      </header>

      <section className="hero" id="top">
        <div><p className="eyebrow">{today.label.toUpperCase()}</p><h1>Deals today</h1><p className="lede">Useful food deals near the mall, with uncertainty shown instead of hidden.</p></div>
        <aside className="research-card" aria-label="Research coverage"><span className="pulse" aria-hidden="true" /><div><strong>Sources checked today</strong><span>{activeDeals.length} active today · reviewed Sep 7</span></div></aside>
      </section>

      <section className="section-shell" aria-labelledby="today-heading">
        <div className="section-heading"><div><p className="section-kicker">READY TO USE</p><h2 id="today-heading">Best-supported deals</h2></div><p>Prices before tax · tap source to verify</p></div>
        <div className="deal-grid">
          {activeDeals.map((deal) => (
            <article className="deal-card" key={`${deal.restaurant}-${deal.title}`}>
              <div className="card-top"><p className="restaurant">{deal.restaurant}</p><p className="price">{deal.price}</p></div>
              <h3>{deal.title}</h3><p className="deal-detail">{deal.detail}</p>
              <div className="badges">{deal.badges.map((badge) => <span key={badge}>{badge}</span>)}</div>
              <a className="source-link" href={deal.source} target="_blank" rel="noreferrer">{deal.sourceLabel}<span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="watch-section" aria-labelledby="watch-heading">
        <div className="section-heading inverse"><div><p className="section-kicker">CHECK FIRST</p><h2 id="watch-heading">Real deals, missing details</h2></div><p>Not safe to present as confirmed for today</p></div>
        <div className="watch-list">
          {uncertain.map((item, index) => (
            <article key={item.name}><span className="watch-number">0{index + 1}</span><div><h3>{item.name}</h3><p>{item.text}</p></div><span className="state">{item.state}</span></article>
          ))}
        </div>
      </section>

      <section className="app-section" aria-labelledby="app-heading">
        <div><p className="section-kicker">PRIVATE OFFERS</p><h2 id="app-heading">Check the app</h2></div>
        <p>These restaurants may have useful offers, but the public web does not expose a dependable current deal payload.</p>
        <div className="app-chips">{appOnly.map((name) => <span key={name}>{name}</span>)}</div>
      </section>

      <footer><p><strong>Schedule engine:</strong> America/Toronto · sources reviewed September 7, 2026</p><p>Recurring offers are selected by weekday and dated offers expire automatically. Verify participation before travelling or ordering.</p></footer>
    </main>
  );
}
