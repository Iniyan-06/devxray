# DevX-Ray — Developer Workflow Intelligence

> **"You don't have a productivity problem. You have a visibility problem."**

Most development teams ship slower than they should — not because of bad code, but because of invisible inefficiencies baked into their workflow. Ghost dependencies bloating every build. Bundles carrying dead weight nobody audits. Tools installed for one function, doing nothing else. DevX-Ray puts these inefficiencies under a lens.

Paste a GitHub repo. Get a full X-Ray in seconds.

**Live Demo → [https://devxray.vercel.app](https://devxray.vercel.app)**

Zero Setup • No Account Required • Real-Time Analysis • Privacy-First

React • Vite • TypeScript • FastAPI • Python

---

## 📚 Table of Contents

- [Overview](#overview)
- [What Makes It Different](#what-makes-it-different)
- [Core Experience](#core-experience)
- [The Utility Ratio](#the-utility-ratio)
- [Folder Structure](#folder-structure)
- [Technical Pipeline](#technical-pipeline)
- [Tech Stack](#tech-stack)
- [Running Locally](#running-locally)
- [Why DevX-Ray?](#why-devx-ray)

---

## ✚ Overview

DevX-Ray is a developer tool that analyzes any public GitHub repository to identify hidden inefficiencies in the development workflow.

It scans `package.json` against actual source code usage, computes a **Utility Ratio** for every dependency, and surfaces the exact packages bloating your bundle — ranked by waste, graded by severity, and paired with actionable swap suggestions.

No installs. No build steps. No account. Just paste a repo URL and X-Ray it.

---

## ✨ What Makes It Different

| Standard Dev Tools | DevX-Ray |
|---|---|
| Requires local setup | Scan any public repo instantly |
| Shows raw sizes only | Shows **Utility Ratio** (waste %) |
| Static reports | Live GitHub scanning |
| No recommendations | One-click lightweight swap suggestions |
| Dev-only tooling | Shareable audit results |
| Single metric output | Full workflow inefficiency breakdown |

This is not a linter. It is a live dependency intelligence layer for your entire repo.

---

## 🎨 Core Experience

**Instant Repo Scan:** Paste any `owner/repo` or full GitHub URL. DevX-Ray fetches your `package.json`, traverses the source tree, and maps every `import` statement across the entire codebase.

**Ghost Dependency Detection:** Cross-references installed packages against actual usage. Libraries with near-zero import coverage are flagged as ghosts — dead weight in every build.

**Bundle Size Analysis:** Each dependency is scored against its total bundle contribution. You see not just what's installed, but what it's actually costing you in KB.

**Utility Ratio Engine:** For each dependency, DevX-Ray computes how much of the library your code uses versus how much you're shipping. A ratio below 10% is a red flag.

**Lightweight Swap Suggestions:** F and D-grade dependencies are matched against a curated swap registry. Using 2% of Moment.js? DevX-Ray suggests `date-fns` or native `Intl` with a migration path.

**Hall of Shame:** Pre-audited famous repos displayed on the landing page — click any card to run a live scan and see how the biggest projects in the ecosystem measure up.

---

## ⚡ The Utility Ratio

The Utility Ratio is DevX-Ray's core metric. It answers the only question that matters: *how much of what you're shipping are you actually using?*

```
Utility Ratio = (Functions Imported from Library) / (Total Exported Functions in Library)
Waste Score   = 100% - Utility Ratio
```

**Grade thresholds:**

| Grade | Waste Score | Meaning |
|---|---|---|
| A | 0–10% | Clean. Library is well-utilized. |
| B | 11–30% | Minor waste. Acceptable. |
| C | 31–50% | Moderate ghost. Review imports. |
| D | 51–70% | Heavy ghost. Swap recommended. |
| F | 71–100% | Full ghost. This library is a liability. |

---

## 📁 Folder Structure

```
devxray/
├─ README.md
│
├─ backend/
│  ├─ main.py                  # FastAPI entry point
│  ├─ requirements.txt         # Python dependencies
│  ├─ Dockerfile               # Container config for deployment
│  │
│  └─ app/
│     ├─ scanner.py            # GitHub repo traversal & file fetching
│     ├─ parser.py             # Import extraction across file types
│     ├─ scorer.py             # Utility Ratio computation engine
│     ├─ swaps.py              # Lightweight swap registry & suggestions
│     └─ registry.py           # Dependency size & export data
│
└─ frontend/
   ├─ src/
   │  ├─ components/
   │  │  ├─ HallOfShame.tsx    # Pre-audited repo leaderboard
   │  │  ├─ SwapPanel.tsx      # Replacement suggestion engine
   │  │  ├─ TreeMap.tsx        # Visual waste visualization
   │  │  └─ Scanner.tsx        # Core repo scanning interface
   │  │
   │  ├─ hooks/
   │  │  └─ useScanner.ts      # Scanning state & async orchestration
   │  │
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  └─ types.ts              # Strict dependency audit schemas
   │
   ├─ index.html
   ├─ vite.config.ts
   └─ package.json
```

---

## 🔁 Technical Pipeline

### 🔍 Scan Lifecycle

1. **Input:** User pastes a GitHub repo URL or `owner/repo` slug into the frontend.
2. **Request:** Frontend sends the repo identifier to the FastAPI backend.
3. **Fetch:** Backend retrieves `package.json` via GitHub Contents API, extracting all dependencies.
4. **Traverse:** All `.ts`, `.tsx`, `.js`, and `.jsx` files in `src/` are fetched and decoded.
5. **Parse:** `parser.py` extracts every `import` statement across the codebase via AST-aware analysis.
6. **Score:** `scorer.py` computes the Utility Ratio per dependency against the size and export registry.
7. **Respond:** Results are returned to the frontend as structured JSON.
8. **Visualize:** Color-graded Tree Map rendered with per-library drill-down and swap suggestions.

### 🔒 Privacy Model

Repo data is processed ephemerally on the backend — nothing is stored or logged. The GitHub API is called server-side to handle rate limits gracefully. DevX-Ray has no user database and retains no scan history.

---

## 🧪 Tech Stack

**Frontend**

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Visualization | Custom SVG Tree Map |
| Icons | Lucide React |

**Backend**

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Language | Python 3.11 |
| Server | Uvicorn (ASGI) |
| Repo Access | GitHub REST API v3 |
| Import Parsing | AST-aware analysis engine |

**Infrastructure**

| Layer | Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Containerization | Docker |

---

## ▶ Running Locally

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at [http://localhost:8000](http://localhost:8000)

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at [http://localhost:5173](http://localhost:5173)

**Environment Variables**

Create `frontend/.env.local`:
```bash
VITE_API_URL=http://localhost:8000
VITE_GITHUB_TOKEN=your_github_token_here
```

Without a token, GitHub API allows 60 requests/hour. With a token, 5,000/hour.

---

## 💭 Why DevX-Ray?

> *"Standard bundle analyzers show you the crime scene. DevX-Ray names the criminal."*

Every JavaScript project accumulates ghost dependencies. It happens gradually — a deadline here, a convenient package there. Nobody audits what they already shipped because the tooling to do so requires too much setup.

DevX-Ray is built on three beliefs:

- **Visibility is the first fix.** You can't remove what you can't see.
- **The metric has to be actionable.** Raw KB numbers don't tell you what to do. Utility Ratio does.
- **Friction is the enemy.** No installs, no build steps, no accounts. Paste and go.

> *"Your bundle is a graveyard of good intentions. DevX-Ray shows you who's buried there."*

---

**Live Demo → [https://devxray.vercel.app](https://devxray.vercel.app)**
