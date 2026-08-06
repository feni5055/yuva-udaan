]

## Environment

Copy `.env.example` to `.env.local` for local development. Supabase uses the
two public `VITE_SUPABASE_*` values. Cloudflare R2 credentials are server-only
and must be configured in Vercel without a `VITE_` prefix.

New magazine PDFs and covers upload to the private R2 bucket. Publishing from
the admin dashboard copies them to the public R2 bucket. Existing Supabase
Storage magazine files remain supported.

Do not commit secrets. Use `.env.local` locally and Vercel Environment
Variables for deployments.

## CI

A basic GitHub Actions workflow (/.github/workflows/ci.yml) runs install and build on push/pull requests.

## Lockfile

A lockfile has been generated to make installs reproducible (package-lock.json). Use the same package manager across the team.

## Contributing

Please open issues or PRs for changes. Small accessibility, linting, and test improvements are welcome.
