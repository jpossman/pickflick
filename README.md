# PickFlick

**Stop scrolling. Start watching.** PickFlick narrows hundreds of thousands of movies and shows down to the one you'll actually watch tonight, in about two minutes.

## The problem

Streaming catalogs are enormous, and "what should we watch?" often takes longer than the thing you end up watching. Endless browsing leads to decision fatigue, and people give up or rewatch something they've already seen.

## How it works

1. **Movie or show?**
2. **Genres.** Pick any you're in the mood for.
3. **Narrow it down.** Filter by era, length, original language, and minimum rating (all optional).
4. **Keep or pass.** Swipe through a stack of 20 matching titles.
5. **Head-to-head.** Your keepers face off two at a time until one is left.
6. **Tonight's pick.** Get details and where it's streaming in your region.

## Tech

- Plain HTML, CSS, and JavaScript frontend with no framework and no build step
- One serverless function (`api/tmdb.js`) on Vercel that proxies requests to TMDB so the API key never reaches the browser, and only allows the endpoints the app needs
- Data from [The Movie Database (TMDB)](https://www.themoviedb.org/); streaming availability from JustWatch via TMDB

## Run your own copy

1. Get a free TMDB API Read Access Token at themoviedb.org → Settings → API.
2. Import this repo into [Vercel](https://vercel.com).
3. Add an environment variable `TMDB_KEY` with your token, then deploy.

## What's next

- Group mode: friends join a room with a code and vote together
- Filter to only what's on the streaming services you have
- "Free tonight" mode: only titles on free ad-supported services (Tubi, Pluto TV, Roku Channel)

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
