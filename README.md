# SweetCreations

**A full-stack bakery storefront with a Node.js/Express API and MongoDB.**

[View the deployed storefront](https://sweet-creations.vercel.app) · [Browse the source](https://github.com/OleTab22/SweetCreations)

SweetCreations explores the software behind a small bakery business: a customer-facing catalogue and shopping flow, account features, an admin interface, and backend endpoints for products and orders. It brings frontend design and API development together in one project.

## Features and project scope

| Area | What is in the repository |
| --- | --- |
| **Storefront** | Home, catalogue, product details, cart, wishlist, contact, login, and registration pages |
| **Accounts** | Registration/login controller, password hashing, and JWT-based authentication logic |
| **Product API** | Product listing, filtering, sorting, pagination, details, and admin-protected management routes |
| **Orders** | Authenticated order routes and admin-protected update/delete routes |
| **Administration** | Admin pages and backend route modules |
| **Checkout exploration** | Yoco checkout/webhook/refund route code; external payment flows still require valid configuration and testing |

These are repository capabilities and development surfaces, not a claim that every commercial workflow is production-ready.

## Technology stack

- **Frontend:** HTML, CSS, vanilla JavaScript, and static assets under `public_html/`
- **Backend:** Node.js, Express, middleware, REST endpoints
- **Database:** MongoDB with Mongoose
- **Authentication:** bcrypt password hashing and JWT
- **API tooling:** Swagger/OpenAPI packages and Jest test configuration
- **Integration work:** Yoco payment route code and related environment configuration

## Project structure

| Directory | Purpose |
| --- | --- |
| [`public_html/`](public_html/) | Storefront pages, styles, images, and browser scripts |
| [`backend/routes/`](backend/routes/) | Product, account, order, admin, and payment routes |
| [`backend/controllers/`](backend/controllers/) | Request handlers |
| [`backend/models/`](backend/models/) | Data models |
| [`backend/config/`](backend/config/) | Database and service configuration |
| [`backend/test/`](backend/test/) | Backend test sources |

## Run locally

**Requirements:** a supported Node.js/npm installation and a MongoDB connection.

1. Clone the project:

   ```bash
   git clone https://github.com/OleTab22/SweetCreations.git
   cd SweetCreations
   npm install
   ```

2. Create a local `.env` file in the repository root. The current backend checks for these environment variables when it starts:

   ```dotenv
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   STRIPE_SECRET_KEY=your_test_key
   CORS_ORIGIN=http://localhost:5000
   PORT=5000
   ```

   Payment-related routes may require additional configuration such as `YOCO_SECRET_KEY`. Use test credentials when exploring payment features, and never commit actual secrets or `.env` files.

3. Start the Express server:

   ```bash
   npm start
   ```

   With the default port, the app is served at http://localhost:5000. The backend includes a small test endpoint at `/api/test`.

## Tests

The root `package.json` defines:

```bash
npm test
```

The focused backend validation test workflow passed **2 of 2 tests** on Node.js 22 in [GitHub Actions on 27 October 2026](https://github.com/OleTab22/SweetCreations/actions/runs/40486193833), after correcting the validator exports in [PR #3](https://github.com/OleTab22/SweetCreations/pull/3).

That check covers email and password validation only. The wider repository contains legacy and incomplete test files; the full authentication, database, order, and payment flows still need reliable integration tests.

## Development notes

- The deployed storefront is a useful visual demo, but running the complete backend requires a working database and configured service keys.
- Checkout, refunds, and webhook handling need review and end-to-end sandbox verification before real transactions.
- This is a portfolio software project, not a production service guarantee.

## Author

Developed by **Olebogeng Tabane** as part of a growing software-engineering portfolio.
