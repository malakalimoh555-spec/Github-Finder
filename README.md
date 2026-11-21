# GitHub Finder

A small web app that looks up a GitHub user by username and shows their public profile.

**Live demo:** https://github-finder-omega-green.vercel.app

## Features

- Search any GitHub username (button or Enter key)
- Profile card with avatar, name, bio, repos, followers and following
- Location, company and website when available
- Loading spinner while the data is being fetched
- Clear error messages for unknown users and API rate limits

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- `useEffect` for data fetching
- GitHub REST API: `GET https://api.github.com/users/{username}`

## Getting Started

```bash
git clone https://github.com/malakalimoh555-spec/Github-Finder.git
cd Github-Finder
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## How It Works

When the user submits a username, it is saved in state. A `useEffect` watches that state and sends a request to the GitHub API whenever it changes. The effect also cancels the previous request, so an old response never overwrites a newer one.

## Note

The GitHub API allows 60 unauthenticated requests per hour per IP address. If you hit the limit, wait a few minutes and try again.
