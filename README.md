# Moodify

Express API + static UI: pick a mood → random YouTube results (YouTube Data API v3).

## Layout

```
moodify/
├── public/                 # Static front-end
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── src/
│   ├── server.js           # Entry: env, HTTP listen, Mongo
│   ├── app.js              # Express app + routes + static
│   ├── config/
│   │   ├── env.js          # .env path + YouTube key helper
│   │   └── moods.js        # Mood → search queries
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── docker-compose.yml
├── Dockerfile
├── .env                    # not committed — copy from .env.example
└── package.json
```

## Tests

```bash
npm test
```

Jest + Supertest: mood config helpers and HTTP routes (no Mongo, no real YouTube calls).

## Local (no Docker)

1. Copy `.env.example` → `.env` and set `YOUTUBE_API_KEY` (and `JWT_SECRET`).
2. Start Mongo locally if you use auth / saved tracks.
3. `npm install` → `npm run dev` → open http://localhost:3000

## Docker

From the **`moodify`** folder (the one that contains `package.json` — do **not** run `cd moodify` if your prompt already ends with `moodify`):

```bash
npm run docker:up
```

**If you see `no such service: #`:** your `package.json` script must be **only**  
`docker compose up --build -d` — **no** `# comments` on the same line (npm passes them to Docker). Fix with:

```bash
npm pkg set scripts.docker:up="docker compose up --build -d"
```

- App: http://localhost:3000  
- Mongo on host: `localhost:27018`  
- Compose injects `MONGO_URI` for the app container; keep `YOUTUBE_API_KEY` in `.env`.

```bash
npm run docker:logs
npm run docker:down
```

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/bootstrap` | `{ moods, youtubeConfigured }` (single front-end load) |
| GET | `/api/moods/recommend?mood=` | YouTube suggestions |
| GET | `/api/music-config` | Legacy JSON status |
