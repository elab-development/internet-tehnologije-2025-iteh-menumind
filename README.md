# MenuMind - AI-Powered Restaurant Experience

**MenuMind** is a modern digital menu and restaurant management platform designed to replace traditional paper menus with QR-based, AI-powered experiences.  
It enables restaurants to manage menus, categories, and items in real time, while allowing guests to interact with an intelligent chatbot that understands the restaurant’s actual menu data.

---

## Overview

MenuMind solves three core problems in modern restaurants:

1. **Static menus** - paper menus are expensive to update and error-prone
2. **Poor customer experience** - guests often have questions about ingredients, allergies, or recommendations
3. **Disconnected systems** - menus, QR codes, and customer interaction tools rarely work together

MenuMind combines **QR codes**, **real-time menu management**, and an **AI chatbot** connected directly to the restaurant’s database.

---

## Core Features

- Digital menus accessed via QR codes
- Restaurant dashboard
- Real-time updates across the application
- AI chatbot that answers questions based strictly on the restaurant’s menu
- Secure, restaurant-scoped authentication

---

### `.env` example (local development)

```dotenv
BETTER_AUTH_SECRET=replace_with_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/menumind

GOOGLE_GENERATIVE_AI_API_KEY=replace_with_google_ai_key

CLOUDINARY_CLOUD_NAME=replace_with_cloud_name
CLOUDINARY_API_KEY=replace_with_cloudinary_api_key
CLOUDINARY_API_SECRET=replace_with_cloudinary_api_secret
```

### `.env.production` example (production app runtime)

```dotenv
BETTER_AUTH_SECRET=replace_with_long_random_secret
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgres://postgres:change_me@db:5432/menumind

GOOGLE_GENERATIVE_AI_API_KEY=replace_with_google_ai_key

CLOUDINARY_CLOUD_NAME=replace_with_cloud_name
CLOUDINARY_API_KEY=replace_with_cloudinary_api_key
CLOUDINARY_API_SECRET=replace_with_cloudinary_api_secret
```

### `.env.db` example (Docker Postgres service)

```dotenv
POSTGRES_USER=change_me
POSTGRES_PASSWORD=change_me
POSTGRES_DB=change_me
```

---

## Local Development

1. Clone and install dependencies:

```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-iteh-menumind.git
cd menumind-ai
```

2. Create `.env` using the local example above.

3. Install dependencies:

```bash
pnpm install
```

4. Start the app:

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

---

## Production (Without Docker)

1. Clone and install dependencies:

```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-iteh-menumind.git
cd menumind-ai
```

2. Create `.env` using the production example above.

3. Install dependencies and build:

```bash
pnpm install
pnpm build
```

4. Run server:

```bash
pnpm start
```

The app serves on port `3000` by default.

---

## Production (With Docker)

1. Create `.env.production` and `.env.db` from the examples above.

2. Build and start:

```bash
docker compose up --build
```

3. Open `http://localhost:3000`.

```bash
docker compose down -v
docker compose up --build
```

## API Documentation

- API docs UI: `http://localhost:3000/api-docs`
- Regenerate OpenAPI spec after endpoint changes:

```bash
pnpm openapi:generate
```

Scope note: `/api/auth/*` is handled by Better Auth and excluded from generated endpoint docs.

---
