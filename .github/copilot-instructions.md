
# Copilot instructions for CV Builder App (frontend)

Purpose: give AI coding agents the minimum, practical knowledge needed to be productive editing the frontend of the CV Builder app.

---

## Project type & setup

- **Project type**: React 19 app bootstrapped with Vite
- **Key files**:
  - `index.html` — mounts the app at DOM id `root`
  - `vite.config.js`
  - `src/main.jsx` — app bootstrap
  - `src/App.jsx` — main application component
- **How to run (dev)**:
  - From `frontend/`: `npm install`, then `npm run dev`
  - Vite default port: `http://localhost:5173`
- **Build / preview**:
  - `npm run build`
  - `npm run preview`
- **Linting**:
  - Run `npm run lint`
  - Config: `frontend/eslint.config.js`
  - Note: unused variables starting with `_` or uppercase are ignored (`no-unused-vars` pattern)

---

## Big picture / architecture

- Single-page React application using **plain function components + hooks** (`useState`, `useEffect`).
- No TypeScript in this repo.
- UI is intentionally minimal and synchronous; correctness and debuggability matter more than styling.
- The frontend **does not talk to AI directly**.
  - All AI interaction happens via the backend.
- The frontend communicates with a backend API under `/api/*`.

---

## Backend integration (important)

### CV parsing flow (current primary feature)

The main backend endpoint used by the frontend is:

```

POST /api/cv/parse

````

**Request shape**
```json
{
  "source": "paste | pdf | docx",
  "text": "raw CV text"
}
````

**Response shape**

```json
{
  "cv": {
    "header": {},
    "summary": "",
    "experience": [],
    "education": [],
    "skills": []
  },
  "meta": {
    "confidence": 0.0,
    "warnings": []
  }
}
```

* The `cv` object is the **canonical CV data model**.
* The frontend should treat this structure as the **single source of truth**.
* Presentation (templates, formatting) is strictly separate from content.

---

## Frontend state conventions

* Parsed CV data is stored as `cvData` in React state.
* UI components should **read from `cvData` only** — do not re-derive structure from raw text.
* Early-stage rendering is intentionally plain (debug-style), e.g. headings + lists.
* Editing, AI-assisted rewrites, and templates come later.

---

## Development & proxying

* During development, the frontend expects the backend API to be reachable at the same origin.
* If the backend runs on another port (e.g. `localhost:3000`), configure a proxy in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

---

## Common edit patterns / expectations for AI agents

* Prefer **small, focused changes** that affect a single UI concern.
* Keep components idiomatic:

  * Function components only
  * Hooks for state
  * No class components
  * No global state managers unless explicitly requested
* Avoid premature abstractions.
* UI styles live alongside components (e.g. `App.css`).

  * Small or temporary styles may be inline.

---

## Where to look for examples

* `src/App.jsx` — main app logic, API calls, and rendering
* `src/main.jsx` — React root + `StrictMode`
* `frontend/package.json` — scripts (`dev`, `build`, `preview`, `lint`)
* `frontend/eslint.config.js` — lint rules and browser globals

---

## Testing / verification checklist for PRs

* `npm run dev` → app loads at `http://localhost:5173`
* CV parsing flow works end-to-end with a real or mocked `/api/cv/parse`
* Parsed CV data renders correctly from `cvData`
* `npm run lint` passes with no errors

---

## Do NOT assume

* Do NOT assume direct AI or Ollama access from the frontend.
* Do NOT introduce TypeScript without proposing it first.
* Do NOT couple CV content to presentation or templates.
* Do NOT reintroduce deprecated endpoints or rewrite-only flows unless explicitly requested.

---

If any section is unclear or you want the agent to also scaffold a mock `/api/cv/parse` response for local development, update this file accordingly.

```

If you want, next we can:
- Add **example mock responses** Copilot can copy-paste
- Split instructions into **frontend vs backend** versions
- Add a short **“anti-patterns”** section to prevent regression
```
