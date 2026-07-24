
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

Do NOT commit secrets to the repository. Use .env (local) or repository secrets/CI variables for CI/deploy.

## CI

A basic GitHub Actions workflow (/.github/workflows/ci.yml) runs install and build on push/pull requests.

## Lockfile

A lockfile has been generated to make installs reproducible (package-lock.json). Use the same package manager across the team.

## Contributing

Please open issues or PRs for changes. Small accessibility, linting, and test improvements are welcome.
  