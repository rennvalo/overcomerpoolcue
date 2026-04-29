# overcomerpoolcue

A React + TypeScript SPA for [overcomerpoolcue.com](https://overcomerpoolcue.com) — a pool cue e-commerce site. Built with Vite, Tailwind CSS, and served via nginx inside Docker.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5 + Tailwind CSS |
| Backend API | FastAPI + SQLAlchemy async + PostgreSQL 15 |
| Article Generator | Python 3.11 + Gemini LLM + Unsplash |
| Serving | nginx (port 8432) + Cloudflare Tunnel |
| Orchestration | Docker Compose |

---

## SEO Blog / Article Generation System

### Overview

An automated article generation pipeline publishes SEO-optimized blog posts about pool and billiards to the site on a configurable schedule. Articles are written by the Gemini LLM (with multi-key fallback), paired with Unsplash photos, and attributed to randomly generated human author profiles.

### What was added

- **`backend/`** — FastAPI service exposing `/api/blog` (paginated list) and `/api/blog/{slug}` (single post). Auto-creates PostgreSQL tables on startup. Uses `bcrypt` directly for password hashing (passlib is incompatible with bcrypt ≥ 4.0).
- **`backend/scripts/fullarticlegen.py`** — Article generation pipeline (~500 lines):
  - Selects from 150+ predefined pool/billiards topics (or asks the LLM for a fresh one 10% of the time)
  - Generates 1500+ word Markdown articles with SEO meta description and slug
  - LLM fallback chain: `GEMINI_API_KEY` → `GEMINI_API_KEY2` → `GEMINI_API_KEY3` → `LLM_ENDPOINT`
  - 20% of articles include a natural product mention linking to overcomerpoolcue.com
  - Fetches a relevant Unsplash photo based on keywords extracted from the article title
  - Assigns a randomly generated human author (60% female / 40% male, age 28–45, pool-related occupation)
- **`src/pages/Blog.tsx`** — Paginated blog listing page with category filter and article cards
- **`src/pages/BlogPost.tsx`** — Individual article page with Markdown rendering (`react-markdown`), SEO meta tags, author bio card
- **`src/components/Navbar.tsx`** — Added "Blog" nav link; switched to React Router `<Link>` for all nav items
- **`nginx.conf`** — Added `/api/` proxy block forwarding to the backend container
- **`tailwind.config.ts`** — Enabled `@tailwindcss/typography` plugin for Markdown prose styling

### Services (Docker Compose)

| Container | Purpose |
|---|---|
| `overcomer-db` | PostgreSQL 15 — stores users, profiles, blog posts |
| `overcomer-backend` | FastAPI on port 8000 (internal) |
| `overcomer-article-gen` | Runs `fullarticlegen.py` on a 24-hour loop |
| `overcomer-poolcue` | nginx serving the React SPA on port 8432 |
| `overcomer-tunnel` | Cloudflare tunnel — exposes the site publicly |

### Monitoring Logs

```bash
# Follow the article generator live (pipeline takes 15–60s per article)
docker logs -f overcomer-article-gen

# Show last 50 lines
docker logs --tail 50 overcomer-article-gen

# Show logs with timestamps
docker logs -t overcomer-article-gen

# Follow all overcomer services at once
docker compose logs -f

# Check backend API logs
docker logs -f overcomer-backend
```

### Running a Test Article Immediately

```bash
docker compose exec article_generator python -u scripts/fullarticlegen.py --test
```

### Verify Articles via API

```bash
# List all published posts
curl http://localhost:8000/api/blog

# Get a specific post by slug
curl http://localhost:8000/api/blog/<slug>
```

### Key Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` / `GEMINI_API_KEY2` / `GEMINI_API_KEY3` | Gemini LLM keys (tried in order) |
| `LLM_ENDPOINT` | Fallback HTTP LLM endpoint if all Gemini keys fail |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key for article cover photos |
| `ARTICLE_INTERVAL_HOURS` | How often to generate a new article (default: 24) |
| `ARTICLE_BOT_USERNAME` / `ARTICLE_BOT_PASSWORD` | Internal account used to publish articles |
| `DATABASE_URL` | Async PostgreSQL connection string |

---

## Development

All dependencies are installed inside Docker containers — nothing needs to be installed on the host.

```bash
# Start all services
docker compose up -d

# Rebuild after code changes
docker compose build web && docker compose up -d --no-deps web
docker compose build backend && docker compose up -d --no-deps backend

# Stop everything
docker compose down
```