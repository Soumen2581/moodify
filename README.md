# Moodify

Pick a **mood** → get **random YouTube** suggestions (**YouTube Data API v3**).
Full **MERN** stack: **MongoDB**, **Express**, **React** (Vite), **Node.js**, all wired together with **Docker Compose**.

**The app is meant to run only with Docker** (see below). Tests still use `npm install` + `npm test` locally or in CI.

---

## Run the app (Docker only)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2) running.

1. Clone this repo and `cd` into the **`moodify`** folder (where `docker-compose.yml` is).

2. Create **`.env`** in the project root with at least:

   ```env
   PORT=3000
   JWT_SECRET=replace_with_a_long_random_value
   YOUTUBE_API_KEY=your_youtube_data_api_v3_key
   ```

   (Compose sets **`MONGO_URI`** for the app container automatically.)

3. Start containers:

   ```bash
   npm start
   ```

   Same as: `docker compose up --build -d`. The build runs the React production build inside Docker and bakes it into the runtime image.

4. Open **http://localhost:3000**

5. **Logs:** `npm run logs`
6. **Stop:** `npm run stop` (same as `docker compose down`)

**MongoDB** from your Mac (optional tools): `mongodb://localhost:27018`

---

## Run the React client in dev (optional, faster iteration)

Docker is required to demo. For tight UI iteration loops, you can also run the Vite dev server:

```bash
# 1. Backend on :3000 (e.g. via Docker)
npm start

# 2. React dev server on :5173 in another terminal
npm run client:install   # first time only
npm run client:dev
```

Vite proxies `/api/*` to the backend, so React code calls `/api/...` exactly like in production.

---

## IntelliJ IDEA — run with Docker (Compose)

**Requirements:** Docker Desktop running; **Docker** plugin enabled (bundled in **Ultimate**; in **Community** install the *Docker* plugin under **Settings → Plugins**).

### Option A — use the shared run config (this repo)

1. **File → Open…** → select the **`moodify`** folder (where `docker-compose.yml` lives).
2. Create `.env` in the project root and set `YOUTUBE_API_KEY` and `JWT_SECRET` (same keys shown above).
3. Open **Run → Edit Configurations**. You should see **Moodify Docker Compose** (from `.run/Moodify_Docker_Compose.run.xml`). Select it and click **Run** (green triangle).
   - If it is missing: click **+ → Docker → Docker Compose**, then match **Option B** and tick **Store as project file** → save under `.run/`.

### Option B — create the config by hand

1. **Run → Edit Configurations → + → Docker → Docker Compose**.
2. **Name:** `Moodify Docker Compose`.
3. **Compose files:** `docker-compose.yml` (project root).
4. **Services:** enable **mongo** and **app**.
5. **Command / options:** enable **Build** (adds `--build`) before start.
6. **Apply → Run**. Use **Services** tool window to **Stop** / **Down** when finished.

Then open **http://localhost:3000**.

---

## What it does (short)

1. React loads moods from `GET /api/bootstrap`.
2. Click a mood → `GET /api/moods/recommend?mood=…`.
3. Server calls YouTube with **`YOUTUBE_API_KEY`** from `.env` (never exposed to the browser).

---

## Stack (MERN)

| Piece | Role |
|-------|------|
| **M** — MongoDB + Mongoose | Users + saved tracks |
| **E** — Express 5 | JSON API (`/api/*`) + static React build |
| **R** — React 18 + Vite | UI built to `client/dist` |
| **N** — Node.js 20 | Server runtime |
| Axios | YouTube `search` calls |
| JWT + Helmet | Auth + security headers |
| dotenv | Loads `.env` in the container (via Compose `env_file`) |
| Docker Compose | **Only** supported way to run app + Mongo |
| Jest + Supertest | Unit + HTTP-route tests |
| GitHub Actions | Runs tests on every push |

---

## Tests (not Docker runtime)

For **Jest** on your machine (or in GitHub Actions):

```bash
npm install
npm test
```

---

## Layout

```
client/                # React frontend (Vite)
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    api.js
    styles.css
    components/
src/                   # Express backend
  server.js            # entry
  app.js               # Express + API routes + serves client/dist
  config/  controllers/  middleware/  models/  routes/
tests/                 # Jest + Supertest
Dockerfile             # multi-stage: builds client → bundles server
docker-compose.yml     # mongo + app
```

---

## API (short)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/bootstrap` | moods + `youtubeConfigured` |
| GET | `/api/moods/recommend?mood=` | YouTube results |
| POST | `/api/auth/register`, `/api/auth/login` | auth |
| * | `/api/tracks` | saved tracks (JWT) |

---

## Git

Files listed in `.gitignore` and `client/.gitignore` (for example `.env`, `node_modules/`, `client/dist/`, `docs/`, Office temp `~$*`) are not committed.

## License

ISC
