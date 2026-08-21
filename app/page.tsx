type Deal = {
  restaurant: string;
  title: string;
  price: string;
  detail: string;
  badges: string[];
  source: string;
  sourceLabel: string;
};

const deals: Deal[] = [
  { restaurant: "KFC", title: "Famous Chicken Sandwich", price: "$5.95", detail: "Friday's Sandwich of the Day. Participating locations; confirm the Erin Mills restaurant before ordering.", badges: ["FRIDAY ONLY", "PUBLIC", "UNDER $10"], source: "https://www.kfc.ca/promo-terms", sourceLabel: "KFC promotion terms" },
  { restaurant: "Domino's · Store 10285", title: "Medium 1-topping pizza", price: "$8", detail: "Coupon FIRE. $3 from each pizza goes to the fundraiser. Store at 2555 Erin Centre Blvd.", badges: ["PUBLIC", "LOCAL STORE", "UNDER $10"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons" },
  { restaurant: "Domino's · Store 10285", title: "Mix & match — 2 or more", price: "$8.99 ea.", detail: "Medium 2-topping pizza, pasta, chicken, select breads, desserts and more. Coupon 893WS; extras may cost more.", badges: ["PUBLIC", "LOCAL STORE", "2+ ITEMS"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons" },
  { restaurant: "Turtle Jack's · Erin Mills", title: "Daily Happy Hour", price: "$5–$16", detail: "Today from 2–5 pm and 8 pm–close. Includes $6 sweet potato fries, $15 classic burger and $7 draught.", badges: ["TODAY", "PUBLIC", "TIME LIMITED"], source: "https://turtlejacks.com/happy-hour/", sourceLabel: "Turtle Jack's Happy Hour" },
  { restaurant: "Subway", title: "Blue Jays game-day Footlong", price: "25% off", detail: "Use STRIKEOUT on a scheduled Blue Jays game day. App/online orders only; participating Canadian restaurants.", badges: ["GAME DAY", "ONLINE", "CODE REQUIRED"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers" },
  { restaurant: "Pizza Pizza", title: "Large pizza + 3 drinks", price: "$16.25", detail: "Large 3-topping pizza and three drinks. Public catalog price; local pricing at 2690 Erin Centre Blvd needs checkout confirmation.", badges: ["PUBLIC", "LOCAL CHECK NEEDED"], source: "https://www.pizzapizza.ca/catalog/products/specials-11035/", sourceLabel: "Pizza Pizza specials" },
  { restaurant: "Sultan Ahmet · Mississauga", title: "Lunch special doner", price: "$14.50", detail: "Chicken, beef, or mixed doner with bulgur, rice, or bread. Lunch hours are not clearly published online.", badges: ["LUNCH", "PUBLIC", "TIME CHECK NEEDED"], source: "https://order.sultanahmet.ca/", sourceLabel: "Mississauga ordering menu" },
  { restaurant: "New York Fries", title: "CAA member discount", price: "10% off", detail: "Present a valid CAA membership before ordering. Participating locations; cannot be combined with another offer.", badges: ["MEMBERSHIP", "PUBLIC TERMS"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions" },
];

const uncertain = [
  { name: "Hero Certified Burgers", state: "Schedule unclear", text: "Seven Daily Deal items and prices are public, but the page does not map them to weekdays." },
  { name: "Thai Express", state: "Partially observable", text: "The Erin Mills outlet advertises daily specials, but today's item and price are not exposed." },
  { name: "Taza Xpress", state: "Outside radius", text: "Friday is two chicken shawarma on the rocks, but no price is published and the surfaced outlet is too far away." },
  { name: "Firehouse Subs", state: "Conditional", text: "BOGO medium sub only if a Friday–Sunday MLB game goes to extra innings; Rewards account required." },
];

const appOnly = ["A&W", "Tim Hortons", "Taco Bell", "Freshii", "Poulet Rouge"];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Erin Mills Deals home"><span className="brand-mark">EM</span><span>Erin Mills Deals</span></a>
        <p>Within roughly 1 km of Erin Mills Town Centre</p>
      </header>

      <section className="hero" id="top">
        <div><p className="eyebrow">FRIDAY · AUGUST 21, 2026</p><h1>Deals today</h1><p className="lede">Useful food deals near the mall, with uncertainty shown instead of hidden.</p></div>
        <aside className="research-card" aria-label="Research coverage"><span className="pulse" aria-hidden="true" /><div><strong>16 sources checked</strong><span>7 useful today · 3 partial · 6 app or session-bound</span></div></aside>
      </section>

      <section className="section-shell" aria-labelledby="today-heading">
        <div className="section-heading"><div><p className="section-kicker">READY TO USE</p><h2 id="today-heading">Best-supported deals</h2></div><p>Prices before tax · tap source to verify</p></div>
        <div className="deal-grid">
          {deals.map((deal) => (
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

      <footer><p><strong>Research snapshot:</strong> August 21, 2026 · America/Toronto</p><p>Offers can change without notice. Verify participation before travelling or ordering.</p></footer>
    </main>
  );
}
