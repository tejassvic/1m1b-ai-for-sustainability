# Verdant API

The backend for **Verdant** — an AI sustainability assistant for individuals and
communities. FastAPI + retrieval-augmented generation + IBM Granite.

## The one design rule

> **Numbers are calculated. Language is generated. The two never swap places.**

Three engines sit behind the API, and they are deliberately kept apart:

| Engine | Responsibility | Can it invent a number? |
| --- | --- | --- |
| **Retrieval** (`services/rag`) | Finds the passages that address a question | — |
| **Impact** (`services/impact`) | Calculates emission estimates by arithmetic | No — pure functions over fixed factors |
| **Language** (`services/llm`) | Explains and converses | No — instructed not to, and checked by tests |

That separation is what makes the platform defensible. A language model may
explain a figure; it may never produce one.

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open <http://localhost:8000/docs> for the interactive API reference.

**The platform runs with no credentials at all.** With nothing configured it uses
the grounded extractive responder, which assembles answers from retrieved source
sentences and says so. Configure IBM Granite and the same code path starts
generating instead.

## Configuring IBM Granite

Copy `.env.example` to `.env` and set:

```ini
WATSONX_API_KEY=<your IBM Cloud API key>
WATSONX_PROJECT_ID=<your watsonx.ai project id>
WATSONX_MODEL_ID=ibm/granite-3-8b-instruct
```

`LLM_PROVIDER=auto` (the default) then selects `watsonx-granite` automatically.
Provider selection is explicit rather than a network probe, so a health check
never blocks on an unreachable host.

To run Granite locally instead, with [Ollama](https://ollama.com):

```bash
ollama pull granite3.2
```

```ini
OLLAMA_ENABLED=true
OLLAMA_MODEL=granite3.2:latest
```

| `LLM_PROVIDER` | Behaviour |
| --- | --- |
| `auto` *(default)* | Granite on watsonx.ai if credentials exist → Ollama if enabled → grounded responder |
| `watsonx` | Force IBM Granite via watsonx.ai |
| `ollama` | Force a local Granite model via Ollama |
| `grounded` | Force the offline extractive responder |

If a configured provider fails at call time, the request is served by the
grounded responder rather than failing, and the response names the provider that
actually answered.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Service, retrieval and model status |
| `POST` | `/api/v1/chat` | Ask a sustainability question |
| `POST` | `/api/v1/impact` | Estimate and explain an annual impact profile |
| `GET` | `/api/v1/recommendations?topic=` | Topic-keyed recommendations |
| `GET` | `/api/v1/recommendations/topics` | Available topic slugs |

### `POST /api/v1/chat`

```json
{
  "message": "How can our campus save water?",
  "history": [],
  "impact": null
}
```

```json
{
  "answer": "…",
  "sources": [{ "title": "…", "publisher": "UNEP", "excerpt": "…", "relevance": 0.42 }],
  "actions": ["Fix leaks before changing habits — …"],
  "grounded": true,
  "provider": "watsonx-granite",
  "model": "ibm/granite-3-8b-instruct",
  "disclaimer": "…"
}
```

Every answer carries the sources it was built from, so a reader can check it
rather than trust it.

An optional `impact` object may be supplied. The **server recomputes it** — a
client cannot hand the model an unverified total to explain.

### `POST /api/v1/impact`

```json
{
  "transport": { "mode": "car_petrol", "distance_km_per_week": 180 },
  "energy": { "electricity_kwh_per_month": 220 },
  "waste": { "waste_kg_per_week": 9, "recycles": false, "composts": false },
  "lifestyle": { "single_use_items_per_week": 12, "sustainable_purchasing": "sometimes" }
}
```

Returns both scenarios (`current`, `sustainable`), the contributors with their
shares, "current choice → better choice" comparison cards, ranked
recommendations carrying their modelled kilogram saving, and an explanation.

## Architecture

```
POST /api/v1/chat
        │
        ▼
   Retriever ──► Context Builder ──► System Prompt ──► Provider ──► Response
        │                                                │        (answer,
   TF-IDF vectors                                    Granite      sources,
   over 13 documents                                 / Ollama     actions)
                                                       / grounded

POST /api/v1/impact
        │
        ▼
   Calculators ──► Recommendations ──► Narrative ──► Provider ──► Response
   (pure arithmetic)                   (factual)     (explains)   (figures
                                                                   unchanged)
```

## Retrieval

| Stage | Choice | Why |
| --- | --- | --- |
| Loader | Markdown with a `---` header block | Provenance travels with the text |
| Chunker | Heading-aware, then windowed (900 / 150 overlap) | Keeps passages coherent |
| Embeddings | TF-IDF, word n-grams, L2-normalised | Deterministic, trains in milliseconds, downloads nothing |
| Store | In-memory matrix, cosine = dot product | 79 chunks, no external service |
| Ranking | Cosine + prefix-tolerant keyword boost | Recovers "campus" → "campuses" without a stemmer |

Every stage is a separate module behind a small interface. Swapping TF-IDF for a
transformer model, or the in-memory store for FAISS or an external vector
database, means implementing two methods — no API-layer changes.

## Knowledge base

13 curated documents in `app/data/knowledge/`, covering waste, water, energy,
transport, consumption, biodiversity, community climate risk, SDG 11/12/13,
impact methodology and the platform's own responsible-AI policy. Each carries a
named publisher so citations resolve to something real.

## Responsible AI, enforced rather than asserted

- **No invented numbers.** The impact system prompt forbids calculation, and
  `test_impact_totals_come_from_the_calculators` fails if a figure ever drifts.
- **No invented citations.** The chat prompt requires grounding in the supplied
  passages and instructs the model to say when they do not answer the question.
- **No false certainty.** Guidance is labelled as guidance, estimates as
  estimates, and the absence of data is never presented as low impact.
- **No PII.** No accounts, no server-side conversation storage. Coordinates are
  accepted only as optional context and are never logged.
- **Honest about itself.** When no model is configured, the response says the
  text was assembled from sources rather than generated. A prototype that hides
  that distinction teaches the wrong lesson about AI systems.

## Tests

```bash
python -m pytest
```

23 tests covering the calculators (linearity, determinism, monotonicity), the
retrieval pipeline, and every endpoint — including validation rejections and the
"figures come from the calculators" guarantee.

## Project layout

```
backend/
├── app/
│   ├── main.py                  app, CORS, lifespan warm-up
│   ├── core/                    config (env + .env), logging
│   ├── api/                     health · chat · impact · recommendations
│   ├── schemas/                 Pydantic request/response contracts
│   ├── data/knowledge/          13 curated Markdown sources
│   └── services/
│       ├── assistant.py         orchestration
│       ├── text_utils.py        shared tokenisation and overlap
│       ├── rag/                 loader · chunker · embeddings · store · retriever · context · index
│       ├── impact/              factors · calculators · recommendations · catalogue · narrative
│       └── llm/                 base · granite · ollama · grounded · prompts · factory
├── tests/                       23 tests
├── requirements.txt
└── .env.example
```

## Environment reference

| Variable | Default | Purpose |
| --- | --- | --- |
| `VERDANT_CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed browser origins |
| `LLM_PROVIDER` | `auto` | Provider selection |
| `WATSONX_*` | — | IBM Granite on watsonx.ai |
| `OLLAMA_ENABLED` / `OLLAMA_BASE_URL` / `OLLAMA_MODEL` | `false` / `http://localhost:11434` / `granite3.2:latest` | Local Granite |
| `LLM_TEMPERATURE` / `LLM_MAX_TOKENS` / `LLM_TIMEOUT_SECONDS` | `0.2` / `900` / `60` | Generation |
| `RETRIEVAL_TOP_K` | `4` | Passages per answer |
| `CHUNK_SIZE` / `CHUNK_OVERLAP` | `900` / `150` | Chunking |
| `MIN_SIMILARITY` | `0.05` | Relevance floor |
