# Moodify

**Mood-based music discovery** using the **YouTube Data API v3**: pick a mood, the app picks a search phrase, and you get a fresh set of videos. Built with **Node.js**, **Express**, a small **static front end**, optional **MongoDB** (auth + saved tracks), **Docker**, and **automated tests**.

---

## For your class presentation

Use the sections below to answer the three common questions: **why**, **what tools**, and **how you used those tools**.

### Why this project

- **User problem:** People often want music that matches how they feel, not only what they already follow. Big apps optimize for engagement; this project keeps the idea simple: **one tap on a mood → new suggestions**.
- **Learning goals:** Practice a **full stack** flow—HTTP API, **calling an external REST API** (YouTube), **environment-based configuration**, optional **database + JWT auth**, **containerized deployment**, and **tests + CI** so the demo stays reliable when you present.

### Tools used (stack)

| Tool | What it does in Moodify |
|------|-------------------------|
| **Node.js** | JavaScript runtime for the server |
| **npm** | Installs libraries and runs scripts (`dev`, `test`, `docker:*`) |
| **Express** | Web server: JSON routes, static files from `public/` |
| **Axios** | HTTP client: calls YouTube’s `search` API from the server (keeps the API key off the browser) |
| **dotenv** | Loads secrets and config from `.env` at the project root |
| **Helmet** | Sets security-related HTTP headers (including CSP for the UI) |
| **Morgan** | Request logging in development |
| **Mongoose** | Talks to MongoDB for users and saved tracks (optional for the mood demo) |
| **jsonwebtoken** | Issues and checks JWTs for protected routes |
| **HTML / CSS / JS** | Front end in `public/`—no framework required for the demo |
| **Docker & Compose** | Runs the app + Mongo the same way on any machine |
| **Jest + Supertest** | Unit and HTTP tests without hitting real YouTube |
| **GitHub Actions** | Runs `npm ci` and `npm test` on every push to `main` |

### How you used those tools (build story)

1. **Scaffold with npm** — `package.json` defines dependencies and scripts; teammates run `npm install` once.
2. **Express app** (`src/app.js`) — Register routes, apply middleware (JSON body, Helmet, CORS, logging), serve `public/`.
3. **Mood config** (`src/config/moods.js`) — Curated list of moods and **search phrases** per mood; the server picks one at random so results change each time.
4. **YouTube integration** (`src/controllers/moodController.js`) — Read `YOUTUBE_API_KEY` from the environment, validate the mood, call **YouTube Data API v3** `search` with **Axios**, map results to a simple `{ name, artist, imageUrl, listenUrl }` shape for the UI.
5. **Front end** (`public/`) — One `fetch('/api/bootstrap')` loads moods; clicking a mood calls `/api/moods/recommend?mood=…` and renders cards with “Watch” links.
6. **Auth & data (optional for the slide)** — `POST /api/auth/register` and `login` store users in MongoDB; `GET/POST/DELETE /api/tracks` require a **Bearer JWT** from login.
7. **Entry point** (`src/server.js`) — Load `.env`, listen on `PORT`, connect Mongo with a short timeout so the app still runs if Mongo is down (mood + YouTube still work).
8. **Docker** — `Dockerfile` builds a production image (`npm ci --omit=dev`); `docker-compose.yml` adds **Mongo** and wires `MONGO_URI` for the app container.
9. **Quality** — **Jest** tests mood helpers and key API responses; **GitHub Actions** runs the same `npm test` in CI so regressions show up before class.

**One-line demo path:** clone → `cp .env.example .env` → add `YOUTUBE_API_KEY` → `npm run dev` → open http://localhost:3000 → pick a mood.

---

## How it works (architecture)

```text
Browser (public/*.html|css|js)
    → GET /api/bootstrap, /api/moods/recommend?mood=
        → Express (src/app.js, routes, controllers)
            → YouTube Data API v3 (Axios, server-side key)
            → MongoDB (optional: auth, saved tracks)
```

---

## Requirements

- **Node.js 20+** (same major version as the Docker image)
- A **YouTube Data API v3** key from [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com)

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Required for demo | Notes |
|----------|-------------------|--------|
| `YOUTUBE_API_KEY` | Yes (recommendations) | Keep secret; never commit `.env` |
| `JWT_SECRET` | Yes if you demo login / saved tracks | Long random string |
| `MONGO_URI` | Optional locally | Overridden by Docker Compose for the `app` service |
| `PORT` | No | Defaults to `3000` |

## npm scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with file reload (**nodemon**) |
| `npm start` | Production-style: `node src/server.js` |
| `npm test` | **Jest** + **Supertest** (no live YouTube / no Mongo required for current tests) |
| `npm run docker:up` | **Docker Compose**: build app + start Mongo |
| `npm run docker:down` | Stop the Compose stack |
| `npm run docker:logs` | Stream logs from the `app` container |

## Run locally (for the demo)

```bash
npm install
cp .env.example .env
# Edit .env: set YOUTUBE_API_KEY and JWT_SECRET
npm run dev
```

Open **http://localhost:3000**. Start **MongoDB** if you show registration, login, or saved tracks.

## Run with Docker

From the project root (next to `docker-compose.yml`):

```bash
cp .env.example .env   # if needed
npm run docker:up
```

- **App:** http://localhost:3000  
- **Mongo from your laptop:** `mongodb://localhost:27018` (maps into the `mongo` container)

Compose sets `MONGO_URI=mongodb://mongo:27017/moodify` for the app. Your `.env` on the host is read at runtime; it is **not** copied into the image (see `.dockerignore`).

## Project layout

```
moodify/
├── public/              # Static UI (HTML, CSS, JS)
├── src/
│   ├── server.js        # Load env, listen, connect Mongo
│   ├── app.js           # Express app, middleware, routes, static
│   ├── config/          # env.js, moods.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── tests/               # Jest tests
├── .github/workflows/   # CI on GitHub
├── Dockerfile
└── docker-compose.yml
```

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bootstrap` | Mood list + whether YouTube is configured |
| GET | `/api/moods` | Same mood ids as bootstrap |
| GET | `/api/moods/recommend?mood=` | YouTube-backed suggestions |
| GET | `/api/music-config` | Provider + API key configured flag |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT |
| POST | `/api/tracks` | Save track (Bearer JWT) |
| GET | `/api/tracks` | List saved tracks (Bearer JWT) |
| DELETE | `/api/tracks/:id` | Remove saved track (Bearer JWT) |

## Tests and CI

- **Local:** `npm test` — exercises mood helpers and main HTTP routes with **Supertest** (mock-friendly, no real YouTube billable calls in the default suite).
- **CI:** GitHub Actions workflow runs `npm ci` and `npm test` on pushes to `main` (with a Mongo service for parity with production-style setups).

## License

ISC
