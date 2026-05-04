# Moodify

Pick a **mood** → get **random YouTube** suggestions (server calls **YouTube Data API v3** with your key). **Express** API + static **HTML/CSS/JS**. Optional **MongoDB** + **JWT** for sign-up and saved tracks. **Docker** and **Jest** included.

---

## Explain it in 30 seconds

1. The **browser** loads moods from `GET /api/bootstrap`.
2. You click a mood → **JavaScript** calls `GET /api/moods/recommend?mood=…`.
3. **Express** picks a random search phrase for that mood, **Axios** calls YouTube, returns titles + watch links.
4. **`.env`** holds `YOUTUBE_API_KEY` (never sent to the browser).

---

## Stack

| Piece | Role |
|-------|------|
| Node.js + Express | HTTP API + static `public/` |
| Axios | YouTube `search` API (server-side key) |
| dotenv | Loads `.env` |
| Mongoose + JWT | Users + saved tracks (optional) |
| Docker Compose | App + Mongo in containers |
| Jest + Supertest | Tests (see `npm test`) |

---

## Quick start (terminal)

```bash
npm install
cp .env.example .env
# Set YOUTUBE_API_KEY and JWT_SECRET in .env
npm run dev
```

Open **http://localhost:3000**

---

## IntelliJ IDEA (WebStorm / IDEA Ultimate)

1. **File → Open…** and choose the **`moodify`** folder (the one that contains `package.json`).
2. When prompted, trust the project and use the **built-in Node** (or point to your Node 20+).
3. Terminal (**View → Tool Windows → Terminal**): run `npm install`.
4. Create `.env` (copy from `.env.example`) and set `YOUTUBE_API_KEY` and `JWT_SECRET`.
5. **Run** the shared configuration:
   - **Moodify dev** — same as `npm run dev` (nodemon).
   - **Moodify test** — same as `npm test`.

Configs live under **`.run/`**. If they do not appear: **Run → Edit Configurations → + → npm** → set **package.json** to this project’s `package.json` → **Command** `run` → **Scripts** `dev` (or `test`).

---

## Docker

```bash
cp .env.example .env   # add keys
npm run docker:up
```

App: **http://localhost:3000** · Mongo on host: **localhost:27018**

---

## Layout

```
src/server.js    # entry: env, listen, Mongo
src/app.js       # Express + routes + static files
src/config/      # env.js, moods.js
public/          # UI
tests/           # Jest
```

---

## API (short)

| GET | `/api/bootstrap` | moods + `youtubeConfigured` |
| GET | `/api/moods/recommend?mood=` | YouTube results |
| POST | `/api/auth/register`, `/api/auth/login` | auth |
| * | `/api/tracks` | saved tracks (JWT) |

---

## Git (no `docs/` folder in the repo)

`docs/` is **gitignored** (presentation notes stay on your machine only).

```bash
git add -A
git status          # should not list docs/
git commit -m "your message"
git push origin main   # or your branch name
```

## License

ISC
