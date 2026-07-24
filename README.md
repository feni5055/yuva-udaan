
# Magazine website design

This is a code bundle for Magazine website design. The original project is available at https://www.figma.com/design/eybxSa13A2fcDj3aMoY4Kj/Magazine-website-design.

## Running the code

1. Copy .env.example to .env and set values (see below).
2. Run `npm i` to install dependencies.
3. Run `npm run dev` to start the development server.

## Environment

This project reads admin credentials from Vite environment variables (for local/demo use only):

- VITE_ADMIN_EMAILS — comma-separated admin emails (lowercased)
- VITE_ADMIN_PASSWORDS — comma-separated admin passwords

For server-side admin auth (recommended for production), the repository includes a minimal Express auth server (server/index.js) that issues an HTTP-only JWT cookie. Server environment variables (see .env.example):

- ADMIN_EMAILS — comma-separated admin emails
- ADMIN_PASSWORDS — comma-separated admin passwords
- ADMIN_JWT_SECRET — strong random secret used to sign admin tokens
- FRONTEND_ORIGIN — frontend origin allowed for CORS (default http://localhost:5173)

Start the server with: npm run server

Do NOT commit secrets to the repository. Use .env (local) or repository secrets/CI variables for CI/deploy.

## CI

A basic GitHub Actions workflow (/.github/workflows/ci.yml) runs install and build on push/pull requests.

## Lockfile

A lockfile has been generated to make installs reproducible (package-lock.json). Use the same package manager across the team.

## Contributing

Please open issues or PRs for changes. Small accessibility, linting, and test improvements are welcome.
  