# Verdant

**Smarter choices. Healthier communities. A greener future.**

Verdant is an AI sustainability platform for individuals and communities. It
helps someone understand an environmental question, see where their own impact
actually sits, and leave with one action worth taking.

Built as an AI-for-Sustainability project, aligned with **SDG 11** (Sustainable
Cities and Communities), **SDG 12** (Responsible Consumption and Production) and
**SDG 13** (Climate Action).

---

## The one design rule

> **Numbers are calculated. Language is generated. The two never swap places.**

A generative model asked "what is my carbon footprint?" will produce a fluent,
confident and entirely invented number. So Verdant never asks it one.

| Component | Responsibility | Can it invent a number? |
| --- | --- | --- |
| **Retrieval** | Finds the passages that address a question | — |
| **Impact engine** | Calculates estimates by arithmetic over fixed factors | **No** — pure functions |
| **Language model (IBM Granite)** | Explains, converses, recommends | **No** — instructed not to, and tested |

Everything else in this repository follows from that separation. It is also what
makes the numbers checkable: the method is disclosed next to every result, and
the emission factors live in one auditable file.

---

## What it looks like

```
User
 │
 ▼
React frontend  (biophilic design, accessible, dependency-light)
 │
 ├── Ask Verdant ────────┐
 ├── Impact Analyzer ────┤
 └── Initiatives ────────┤
                         ▼
                    FastAPI  /api/v1/{chat,impact,recommendations,health}
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
   Retriever        Calculators       Catalogue
   (TF-IDF over     (emission         (topic-keyed
    13 documents)    factors)          guidance)
        │                │
        ▼                │
   Context builder       │
        │                │
        └────────┬───────┘
                 ▼
        IBM Granite / Ollama / grounded responder
                 │
                 ▼
     answer + sources + actions   ·   figures + method + caveats
```

The backend runs with **no credentials at all**: with nothing configured it uses
a grounded extractive responder that assembles answers from retrieved source
sentences and says so. Add IBM Granite credentials and the same code path starts
generating instead.

---

## Quick start

Two terminals.

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
# source .venv/bin/activate      # macOS / Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: <http://localhost:8000/docs>

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The dev server proxies `/api` to port 8000, so the
browser only ever talks to one origin.

**IBM Granite** is optional. To enable it, copy `backend/.env.example` to
`backend/.env` and set `WATSONX_API_KEY` and `WATSONX_PROJECT_ID`. See
[`backend/README.md`](backend/README.md) for the other provider options,
including running Granite locally with Ollama.

The frontend needs no configuration for local development — the Vite dev server
proxies `/api` to port 8000. For a deployed build, copy `frontend/.env.example`
to `.env.local` and set `VITE_API_BASE_URL`.

---

## Repository layout

```
1m1b/
├── .editorconfig        shared indentation and line endings
├── .gitignore           covers both halves (each also has its own)
├── backend/             FastAPI · RAG · impact engine · IBM Granite
│   ├── app/
│   │   ├── api/         health · chat · impact · recommendations
│   │   ├── core/        config (env + .env) · logging
│   │   ├── schemas/     Pydantic contracts
│   │   ├── data/
│   │   │   └── knowledge/   13 curated, attributed sources
│   │   └── services/
│   │       ├── rag/     loader · chunker · embeddings · store · retriever · context
│   │       ├── impact/  factors · calculators · recommendations · catalogue · narrative
│   │       ├── llm/     base · granite · ollama · grounded · prompts · factory
│   │       └── assistant.py   orchestration
│   ├── tests/           23 tests
│   ├── .env.example     configuration template (works with none of it filled in)
│   └── README.md
├── frontend/            React · Vite · Tailwind
│   ├── src/
│   │   ├── components/  sections, chat, analyzer, form primitives, decorations
│   │   ├── data/        all copy, form config, botanical accent map
│   │   ├── hooks/       useChat · useImpact · useReveal · useCountUp · useScrollSpy
│   │   └── services/    api.js — the only place that knows the API exists
│   ├── scripts/
│   │   └── check-contrast.mjs   WCAG contrast assertion (npm run check:contrast)
│   ├── ssr-check.mjs    build-time render smoke test
│   ├── .env.example     VITE_API_BASE_URL for deployed builds
│   └── README.md
└── prompt.txt           the brief this was built against
```

---

## The two surfaces

### Ask Verdant

Ask a sustainability question in plain language. The answer arrives with the
documents it was built from, the actions it recommends, and the name of the model
that produced it. If the knowledge base does not cover the question, the answer
says so rather than improvising.

### Impact Analyzer

Four short inputs — travel, electricity, waste, a couple of habits — produce an
estimated annual figure, the category breakdown, "current choice → better choice"
comparisons, and ranked actions carrying the kilograms each would save.

Every figure is computed server-side from fixed emission factors. The response
includes the method and an explicit statement that the estimate is an estimate.

---

## Responsible AI

These are enforced in the architecture, not promised in a policy:

| Principle | How it is enforced |
| --- | --- |
| **Transparency** | Every answer carries its sources with the publisher; the model in use is named in the response metadata |
| **Privacy** | No accounts, no server-side conversation storage; coordinates accepted as optional context and never logged |
| **Grounded AI** | Constrained system prompts; the model is instructed to say when the sources do not answer the question |
| **Human agency** | Output framed as guidance, estimates labelled as estimates, every recommendation carries its reasoning |
| **Honesty about itself** | When no model is configured, the response says the text was assembled from sources rather than generated |

The backend test suite includes a guard that fails if an impact figure ever
diverges from the calculator, and the frontend never computes an environmental
figure at all.

---

## Verification

```bash
cd backend  && python -m pytest        # 23 tests
cd frontend && npm run verify          # contrast + smoke + build
```

`npm run verify` runs three checks in order:

| Check | Asserts |
| --- | --- |
| `check:contrast` | All 39 foreground/background pairs meet their WCAG threshold (4.5:1 text, 3:1 graphics) |
| `smoke` | The page server-renders with its content, responsive imagery and accessible names intact |
| `build` | The production bundle compiles and reports its size |

The backend tests cover the calculators (linearity, determinism, monotonicity),
the retrieval pipeline, every endpoint's validation behaviour, and the
"figures come from the calculators" guarantee.

The frontend smoke test fails the build if a section loses its accessible name or
imagery stops being responsive; the contrast check fails it if a palette change
drops any text below the readable threshold.

---

## Limitations

Stated plainly, because a project arguing for responsible AI should be candid
about its own edges:

- **The knowledge base is 13 documents**, covering waste, water, energy,
  transport, consumption, biodiversity, community climate risk and SDG 11/12/13.
  Outside that scope the assistant says it does not know rather than guessing.
- **The emission factors are planning-grade averages**, not regional values. They
  are right for comparing options and wrong for measuring a specific household.
- **Retrieval is TF-IDF**, chosen for determinism and zero downloads. A dense
  embedding model would improve paraphrase handling; it is a two-method swap.
- **Community metrics are labelled pilot placeholders**, not audited outcomes.
- **Photographs load from Unsplash**, trading privacy and offline capability for
  quality. A production deployment should self-host them.
- **No authentication or rate limiting.** Both would be required before any
  public deployment.

