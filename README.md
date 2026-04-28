# Moodify

Pick a mood, get randomized **YouTube** suggestions (YouTube Data API v3). Express API, static front end, optional MongoDB for auth and saved tracks.

## Requirements

- Node 20+ (matches Docker image)
- [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) key

## Environment

Copy `.env.example` to `.env` and set:

| Variable | Required | Notes |
|----------|----------|--------|
| `YOUTUBE_API_KEY` | Yes (for recommendations) | Project root `.env` |
| `JWT_SECRET` | Yes (for `/api/auth`, `/api/tracks`) | Long random string |
| `MONGO_URI` | Optional locally | Docker Compose overrides this for the `app` service |
| `PORT` | No | Default `3000` |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (nodemon) |
| `npm start` | Production-style (`node src/server.js`) |
| `npm test` | Jest + Supertest (no Mongo / no live YouTube) |
| `npm run docker:up` | Build and start app + Mongo (detached) |
| `npm run docker:down` | Stop Compose stack |
| `npm run docker:logs` | Follow app container logs |

## Run locally

```bash
npm install
cp .env.example .env
# edit .env — set YOUTUBE_API_KEY and JWT_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Start Mongo if you use registration, login, or saved tracks.

## Run with Docker

From this directory (where `docker-compose.yml` lives):

```bash
cp .env.example .env   # if you do not have .env yet
npm run docker:up
```

- App: [http://localhost:3000](http://localhost:3000)  
- Mongo on the host: `mongodb://localhost:27018` (maps to the `mongo` service)

Compose sets `MONGO_URI=mongodb://mongo:27017/moodify` for the app container. Keep secrets in `.env` on the host; that file is not copied into the image.

## Project layout

```
moodify/
├── public/           # Static UI
├── src/
│   ├── server.js     # Env, HTTP listen, Mongo
│   ├── app.js        # Express app, routes, static files
│   ├── config/       # env.js, moods.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── tests/            # Jest tests
├── Dockerfile
└── docker-compose.yml
```

## API (overview)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bootstrap` | Moods list + `youtubeConfigured` |
| GET | `/api/moods` | Same mood ids as bootstrap |
| GET | `/api/moods/recommend?mood=` | YouTube-backed suggestions |
| GET | `/api/music-config` | Provider + YouTube key configured flag |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login (JWT) |
| POST | `/api/tracks` | Save a track (Bearer JWT) |
| GET | `/api/tracks` | List saved tracks (Bearer JWT) |
| DELETE | `/api/tracks/:id` | Remove a saved track (Bearer JWT) |

## License

ISC
