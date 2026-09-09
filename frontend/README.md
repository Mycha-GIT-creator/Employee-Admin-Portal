# Employee Admin Portal frontend

React + TypeScript frontend for the ASP.NET Employee Admin Portal API.

## Run locally

1. Start the API with the `http` launch profile so it listens on `http://localhost:5148`.
2. From this directory, run `npm install` and then `npm run dev`.
3. Open `http://localhost:5173`.

Vite proxies `/api` requests to `127.0.0.1:5148`, which avoids Windows `localhost` IPv4/IPv6 resolution differences. Set `VITE_API_PROXY_TARGET` if the API uses another URL. No CORS configuration is needed for local development.
