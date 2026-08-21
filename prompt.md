Build a production-quality personal web application called **Erin Mills Deals**.

The application tracks restaurant food deals within approximately a 1 km radius of Erin Mills Town Centre in Mississauga, Ontario, Canada. Its main purpose is extremely simple: I should be able to open the dashboard and immediately see the useful restaurant deals available **today**.

This is not primarily a restaurant-discovery application. It is a deal aggregation and monitoring application.

## Product behaviour

The home page should default to today's date in the `America/Toronto` timezone and prominently show something equivalent to:

**Deals today — Tuesday**

Each active deal should appear as a compact card showing the restaurant, deal title, price when known, normal price or calculated discount when known, redemption requirements, distance from Erin Mills Town Centre, source, and when the information was last verified.

Deals must support recurring schedules such as every Monday, Tuesdays only, weekdays, weekends, Leafs game days, happy-hour time windows, and arbitrary start/end dates.

Provide day selectors so I can inspect Monday through Sunday.

Provide useful filters including price, distance, membership requirement, pickup/dine-in/online availability, recurring versus temporary promotion, and deal confidence.

Do not confuse "no deal exists" with "we cannot observe this restaurant's deals."

The application must distinguish at least these source states:

`PUBLIC_DEALS_AVAILABLE`

`NO_PUBLIC_DEAL_FOUND`

`APP_OR_MEMBERSHIP_REQUIRED`

`SOCIAL_OR_NEWSLETTER_ONLY`

`SOURCE_FAILED`

`MANUAL`

If a restaurant only exposes offers inside its mobile app, the UI should say something such as "Member/app offers may be available — check app" rather than claiming there are no deals.

Every deal card must link back to its source.

Show a freshness indicator such as "Checked 3 hours ago."

Add an internal admin/source-health page showing every restaurant, its configured sources, last successful collection, last failure, error message, number of deals found, scraper type and whether the source needs attention.

## Initial geographic scope

Use Erin Mills Town Centre, 5100 Erin Mills Parkway, Mississauga, Ontario as the geographic centre.

Store latitude/longitude for restaurants and calculate distance using the Haversine formula. Keep the radius configurable, with 1000 metres as the default.

Create seed data for the restaurants previously identified in and around this area. Include:

A&W; Gong Cha / Arirang Hotdog; BarBurrito; Bourbon St Grill; Butter Chicken Roti; Dickey's Barbecue Pit; Edo Japan; Freshii; Grill It Up; Hero Certified Burgers; Jimmy the Greek; KFC; Taco Bell; King Corn; Mac's Sushi; New York Fries; Pizza Pizza; Poulet Rouge; Shanghai 360; Subway; Thai Express; Tim Hortons; Villa Madina; Wendy's; Turtle Jack's; IHOP; Crêpes De Luxe; Afghan Flame; SHIKAO; Domino's Pizza; Let's Eat; Yaadgaar Curry and Kebab; Sultan Ahmet Turkish Cuisine; Axia Restaurant; Sunset Grill; Firehouse Subs; Taza Xpress; The Kakori; and the restaurant outlets in Credit Valley Hospital if they fall inside the configured radius.

Do not blindly trust this seed list. Verify addresses and calculate the distance. Restaurants outside the radius should remain in the database but should be marked outside the current search radius rather than silently deleted.

Known nearby locations that can be used as verification anchors include Domino's store 10285 at 2555 Erin Centre Blvd and Pizza Pizza at 2690 Erin Centre Blvd.

## Data architecture

Use current stable **Next.js 16 App Router**, React, TypeScript and a clean responsive UI.

Use PostgreSQL. Make it straightforward to use either Supabase Postgres or a normal self-hosted PostgreSQL instance.

Do not unnecessarily introduce an ORM if direct typed SQL or a lightweight query layer is simpler. Choose the simplest maintainable implementation.

Create normalized database entities conceptually equivalent to:

Restaurant

RestaurantSource

Deal

DealOccurrence or recurrence metadata

CollectionRun

ManualOverride

The exact schema is your decision, but Deal must be able to represent restaurant, title, description, deal price, normal price, calculated discount, promo code, membership requirement, redemption channel, recurrence/day-of-week rules, valid-from, valid-until, source URL, location restrictions, first-seen time, last-seen time, last-verified time and confidence.

RestaurantSource should represent things such as official deals page, official ordering site, normal website, Instagram, Facebook, newsletter, app-only source and manual source.

Store raw extraction evidence or a useful source snapshot/hash so parsing errors can be diagnosed later without guessing.

## Collector architecture

Create a separate collector subsystem rather than putting scraping logic directly inside React components or page requests.

Implement an adapter interface so each restaurant or platform can have dedicated collection logic.

The architecture should conceptually resemble:

`RestaurantSource -> CollectorAdapter -> RawDeal[] -> normalize -> validate -> deduplicate -> database`

Prefer ordinary HTTP requests and HTML parsing.

Use Playwright only when a page genuinely requires browser rendering.

Do not use an LLM to extract deals in version 1.

Never invent a deal because parsing failed.

Never infer a price if no price exists in the source.

Never bypass authentication, CAPTCHAs or access controls.

Do not scrape private personalized loyalty data.

Respect reasonable rate limits. Identify the application with a sensible user agent where appropriate.

A failure in one adapter must not stop collection for other restaurants.

Use bounded concurrency, retries with backoff, request timeouts and structured logs.

## Initial real adapters

Implement real working collectors for the strongest sources first.

### Domino's

The nearby location is Domino's store `10285`, 2555 Erin Centre Blvd.

Use the location-specific Domino's pages rather than national generic deal information.

The store page follows the pattern:

`https://pizza.dominos.ca/Mississauga-Ontario-10285/`

and its coupons page:

`https://pizza.dominos.ca/Mississauga-Ontario-10285/coupons/`

Extract coupon title, coupon code when exposed, price, weekday restrictions and relevant conditions.

### Hero Certified Burgers

Use Hero's public offers page:

`https://heroburgers.com/offers/`

It currently exposes Daily Deal items publicly.

Create a Hero-specific parser rather than assuming those cards will have the same HTML forever.

Where the page says only "Daily Deal" without making the weekday unambiguous, do NOT guess the weekday. Store the deal and flag its scheduling information for review.

### Pizza Pizza

Use the nearby Pizza Pizza location at 2690 Erin Centre Blvd and the public Pizza Pizza specials/promotion pages.

A useful public specials source is:

`https://www.pizzapizza.ca/catalog/products/specials-11035`

Also support promotions that have explicit coupon codes and expiry dates.

### Turtle Jack's

Use the Erin Mills location and Turtle Jack's Features & Specials pages.

Support known recurring concepts such as Fajita Tuesdays, half-price wine Wednesdays and Happy Hour, but extract their current terms from the source rather than hard-coding promotional prices indefinitely.

### KFC

Use public Canadian KFC coupon, promotion-term and value/online-deal pages.

Useful starting points include:

`https://www.kfc.ca/coupons`

`https://www.kfc.ca/promo-terms`

`https://www.kfc.ca/menu/kfcca-exclusive-offers`

KFC promotions may require a location. Store whether a promotion has actually been verified for the nearby restaurant.

### New York Fries

Use:

`https://www.newyorkfries.com/promotions`

Parse public promotions and separately mark Fry Society/member-only promotions.

### Thai Express

Use:

`https://thaiexpress.ca/promotions/`

and investigate its official ordering system for location-specific offers.

Do not treat loyalty-only rewards as generally available public deals.

### Sultan Ahmet

Use the Mississauga restaurant site and specifically inspect its Lunch Special menu category.

The source site is:

`https://mississauga.sultanahmet.ca/`

Also permit a manually configured social source because some short-lived promotions are announced through Instagram.

### Taza Xpress

Use:

`https://tazaxpress.ca/`

The restaurant explicitly references daily specials. Build a parser if the daily-special information is available in its website/menu markup; otherwise classify it as partially observable.

### Edo Japan

Investigate the official ordering site at:

`https://order.edojapan.com/`

The platform exposes "Daily Value Deals" on store ordering pages.

Resolve and store the correct Erin Mills-area location identifier before scraping offers.

### Firehouse Subs

Use its Canadian official offer pages and promotion terms. Treat Leafs/game-day or other event-conditioned promotions as conditional deals rather than assigning them to an ordinary weekday.

## Partially observable restaurants

Set up source records for A&W, Wendy's, Freshii and Poulet Rouge but do not attempt to automate private loyalty accounts.

A&W has app-exclusive digital offers.

Wendy's has offers inside Wendy's Rewards.

Freshii may expose promotions during online checkout.

Poulet Rouge provides member and potentially personalized offers.

Show these restaurants in the dashboard with the appropriate membership/app state.

If they also publish a genuinely public promotion, that public promotion may still appear normally.

## Social, newsletter and manual restaurants

Restaurants including Jimmy the Greek, Sunset Grill, Axia, Afghan Flame, Yaadgaar, Arirang Hotdog, Crêpes De Luxe and other local restaurants may lack reliable structured promotion pages.

Create infrastructure for them now even when they cannot be fully automated.

Each can have multiple RestaurantSource records, for example official website, Instagram, Facebook and manual.

Do not make brittle Instagram scraping a dependency for the application to function.

For version 1 it is acceptable for these restaurants to display "social/newsletter source — not automatically monitored" and allow a deal to be entered manually through the admin UI.

## Manual entry

Create an admin form for manually adding or correcting a deal.

Manual deals should use exactly the same data model as automatically collected deals.

Allow entering title, restaurant, price, normal price, promo code, validity dates, weekday recurrence, time restrictions, membership requirement, source URL and notes.

Manual overrides must be able to suppress an obviously incorrect scraped deal without deleting the historical collection record.

## Deal lifecycle and safety against stale information

This is critical.

Do not immediately delete a deal simply because a scrape fails.

Only deactivate previously observed deals when a source collection succeeded and provides enough evidence that the deal has disappeared, or when its explicit expiry date passes.

Track `firstSeen`, `lastSeen` and `lastVerified`.

Temporary deals with explicit expiry dates should disappear automatically after expiration.

Recurring deals should remain in the database but appear on the dashboard only on their applicable day/time.

Display stale warnings when information has not been successfully verified recently.

Deduplicate equivalent deals collected from the same restaurant.

Keep historical deals so I can later inspect how promotions have changed.

## Scheduling

Create a standalone command similar to:

`pnpm collect`

It should collect every enabled source.

Also support something like:

`pnpm collect --restaurant dominos`

and:

`pnpm collect --source <id>`

Create a GitHub Actions workflow using `workflow_dispatch` plus a scheduled trigger.

Run collection several times per day, preferably at non-round-hour times.

Keep scheduling configuration easy to change.

The dashboard itself must never depend on a scrape finishing during an HTTP page request.

## Testing

Add unit tests for normalization, recurrence evaluation, expiry handling, Haversine distance, deduplication and deal lifecycle logic.

For every dedicated collector, save representative fixture HTML and test the parser against fixtures so ordinary frontend markup changes are detectable.

Add integration tests for inserting collection results into the database.

Add at least one Playwright end-to-end test verifying that today's dashboard renders seeded/test deals correctly and filters work.

Tests must not make live restaurant HTTP requests by default.

Create a separate optional live-source smoke-test command.

## Developer experience

Use strict TypeScript.

Add ESLint and formatting.

Provide `.env.example`.

Do not commit secrets.

Provide database migrations and deterministic seed scripts.

Provide Docker support so the entire application can be run locally with PostgreSQL.

Create `README.md` explaining installation, database setup, migrations, seeding, running the collector, running tests and deployment.

Create `AGENTS.md` explaining the architecture and rules future coding agents must follow, particularly the rule that a scraper must never fabricate a deal when extraction fails.

## UI quality

This is a personal utility dashboard, not a marketing site.

Optimize for information density and speed.

Desktop and mobile should both work well.

Today's best deals should be visible without excessive scrolling.

Make dollar amounts prominent.

Use clear badges such as:

`TODAY`

`TUESDAY ONLY`

`MEMBERSHIP REQUIRED`

`APP ONLY`

`PUBLIC`

`CHECKED 2H AGO`

`UNDER $10`

`ENDING SOON`

Show source freshness without cluttering every card.

Add a restaurant view showing current deals, recurring weekly deals, source status and deal history.

Add a weekly view that makes it easy to answer questions such as "Where should I eat on Monday?" or "Which Tuesday deal is cheapest?"

## Scope control

Do not spend time building user accounts, payments, social features or a generic worldwide restaurant-discovery system.

This is initially a single-user Erin Mills restaurant-deal dashboard.

Design the data model cleanly enough that other geographic centres could be added later, but do not over-engineer multi-tenancy now.

## Execution instructions

Start by inspecting the repository.

If it is empty, initialize the project.

Write a short implementation plan before making major changes, then execute the plan rather than stopping after scaffolding.

Research the actual structure of the public deal pages while implementing each adapter instead of inventing selectors.

If a source cannot be collected reliably, implement the source record and manual/partial state rather than hacking around access controls.

Run the test suite, type checking, linting and a production build before declaring the task complete.

At completion, give me a concise summary containing what is fully implemented, which restaurant sources are automatically collected, which remain partial/manual, how to run it locally, and what the highest-value next integrations are.
