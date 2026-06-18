# Quorum Check

Next.js website for Quorum Check, a privacy-first public sentiment and polling platform. The application uses the App Router, TypeScript, Tailwind CSS, and MySQL-backed route handlers.

## Local Development

Install dependencies and run the site from the project root:

```sh
npm install
npm run dev
```

Then open:

```text
http://localhost:3000/
```

Copy `.env.example` to `.env.local`. `AUTH_SECRET` signs login sessions:

```sh
AUTH_SECRET=replace_with_at_least_32_random_characters
```

Application accounts, product activity, contact submissions, and waitlist records are stored locally in `.data/quorum.sqlite`. Email passwords are stored as salted scrypt hashes and successful authentication creates a signed, HTTP-only session cookie. The `.data` directory is ignored by Git.

Authenticated members are redirected to `/feed`. The product routes are `/feed`, `/sentiment-map`, `/debate`, `/insights`, `/communities`, and `/create-poll`. Poll creation, one-vote-per-account enforcement, debate replies, community membership, and insight totals persist across refreshes.

The full frontend requirement matrix and route map are documented in `docs/FEATURE_COVERAGE.md`.

## Production

```sh
npm run build
npm start
```

Vercel detects the project as Next.js using `vercel.json`.
