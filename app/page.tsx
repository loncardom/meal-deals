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
  { restaurant: "Domino's · Store 10285", title: "Mix & match — 2 or more", price: "$8.99 ea.", detail: "Medium 2-topping pizza, pasta, chicken, select breads, desserts and more. Coupon 893WS; extras may cost more.", badges: ["PUBLIC", "LOCAL STORE", "2+ ITEMS"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons" },
  { restaurant: "Domino's · Store 10285", title: "Large 4-topping pizza", price: "$16.99", detail: "Coupon 4201 at the 2555 Erin Centre Blvd store. The location-specific coupon page currently lists this offer.", badges: ["PUBLIC", "LOCAL STORE", "SATURDAY"], source: "https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/", sourceLabel: "Store 10285 coupons" },
  { restaurant: "Turtle Jack's · Erin Mills", title: "Daily Happy Hour", price: "$5–$16", detail: "Today from 2–5 pm and 8 pm–close. Includes $6 sweet potato fries, $15 classic burger and $7 draught.", badges: ["TODAY", "PUBLIC", "TIME LIMITED"], source: "https://turtlejacks.com/happy-hour/", sourceLabel: "Turtle Jack's Happy Hour" },
  { restaurant: "Subway", title: "Five classic Footlongs", price: "Under $10", detail: "Tuna, ham, turkey breast, Veggie Delite, or Cold Cut Combo. Limited-time public offer; participation may vary.", badges: ["PUBLIC", "SATURDAY", "UNDER $10"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers" },
  { restaurant: "Subway", title: "Any Power Bowl", price: "20% off", detail: "Use code 20OFFBOWL when ordering. The offer is currently displayed on Subway Canada's public homepage.", badges: ["PUBLIC", "CODE REQUIRED", "ONLINE"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers" },
  { restaurant: "Subway", title: "Buy 2 Footlongs, get a 3rd free", price: "3rd free", detail: "Buy any two Footlong subs and use code 3SUBS to receive another Footlong free. Participation may vary.", badges: ["PUBLIC", "CODE REQUIRED", "3 ITEMS"], source: "https://www.subway.com/en-ca/", sourceLabel: "Subway Canada offers" },
  { restaurant: "New York Fries", title: "CAA member discount", price: "10% off", detail: "Present a valid CAA membership before ordering. Participating locations; cannot be combined with another offer.", badges: ["MEMBERSHIP", "PUBLIC TERMS"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions" },
  { restaurant: "New York Fries", title: "Repeat-visit points boost", price: "2×–4× points", detail: "Fry Society members: spend at least $5 per visit, 2–4 times by August 30, to earn a matching points multiplier. Points post August 31.", badges: ["MEMBERSHIP", "ENDS AUG 30", "MIN. $5"], source: "https://www.newyorkfries.com/promotions", sourceLabel: "New York Fries promotions" },
];

const uncertain = [
  { name: "Hero Certified Burgers", state: "Schedule unclear", text: "Seven Daily Deal items and prices are public, but the page does not map them to weekdays." },
  { name: "Thai Express", state: "Partially observable", text: "The Erin Mills outlet advertises daily specials, but today's item and price are not exposed." },
  { name: "KFC", state: "Saturday item unclear", text: "KFC lists a $5.95 Sandwich of the Day promotion, but its public terms do not expose which sandwich applies Saturday." },
  { name: "Pizza Pizza", state: "Checkout required", text: "The specials page now gates current products and local pricing behind address selection, so the earlier $16.25 price is not confirmed." },
  { name: "Sultan Ahmet", state: "Time unclear", text: "The lunch-special menu is public, but Saturday lunch availability is not clearly stated online." },
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
        <div><p className="eyebrow">SATURDAY · AUGUST 22, 2026</p><h1>Deals today</h1><p className="lede">Useful food deals near the mall, with uncertainty shown instead of hidden.</p></div>
        <aside className="research-card" aria-label="Research coverage"><span className="pulse" aria-hidden="true" /><div><strong>Saturday source review</strong><span>8 verified offers · 5 unresolved · 5 app-only</span></div></aside>
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

      <footer><p><strong>Research snapshot:</strong> August 22, 2026 · America/Toronto</p><p>Offers can change without notice. Verify participation before travelling or ordering.</p></footer>
    </main>
  );
}
