# Next League client

Next.js app for the [Next League](https://next-league.vercel.app) client. The API, Socket.io server, and Docker Compose live in the repo root. The full write-up is the [root README](../README.md).

## Run the client

The API defaults to port 3050. Point `NEXT_PUBLIC_API_URL` at it.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# http://localhost:3000
```

From the repo root, `docker compose up` starts the client on port 3000 and the API on port 4000. Export `MONGODB_URI` first.

## Where things are

```
app/(auth)/            login and register
app/(dashboard)/       league, play, collection, store
src/components/        shared UI, including virtual-grids and tooltips
src/redux/slices/      client state
src/hooks/             data and UI hooks
src/i18n/              English and Spanish dictionaries
```

English is the default language. Spanish is chosen in settings.

Static game art loads from [league-resources](https://github.com/JonathanLazarte/league-resources), not from this bundle.
