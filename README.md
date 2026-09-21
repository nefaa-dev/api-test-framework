# API Testing Framework

A scalable, maintainable API testing framework built with **Playwright Test** and
**TypeScript**, following layered architecture, typed contracts, and deterministic,
self-cleaning tests. The reference target API is
[restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html).

---

## Features

- **Layered, decoupled architecture** — configuration, HTTP client, models, services,
  builders, fixtures, and tests each have a single responsibility.
- **Typed contracts with runtime validation** — request/response types are derived from
  `zod` schemas (single source of truth) and every response is validated at runtime.
- **Service Object Model** — one service class per API resource encapsulates all endpoint
  knowledge; tests never touch raw HTTP.
- **Dependency injection** — services, an auth token, and a self-cleaning booking factory
  are injected into tests via Playwright fixtures.
- **Test data builders** — the Builder + Factory patterns (with `faker`) produce valid,
  varied data; tests declare only the fields they assert on.
- **Deterministic tests** — each test creates and cleans up its own data, so results never
  depend on shared server state.
- **Custom matchers** — e.g. `toHaveStatus`, which prints the response body on failure.
- **Leveled logging with request timing** — controlled by `LOG_LEVEL`.
- **Tagging** — run `@smoke` (fast critical path) or `@regression` (full) subsets.
- **Quality gates** — ESLint (flat config) + Prettier + type checking.
- **Reporting** — built-in HTML report plus Allure (grouping, severity, steps, trends).
- **CI** — GitHub Actions pipeline (lint → typecheck → test) with report artifacts.
- **Optional Docker packaging** — reproducible Node + Java runtime in one image.

---

## Tech stack

Node 20 · TypeScript · Playwright Test · zod · @faker-js/faker · ESLint + typescript-eslint
(flat config) · Prettier · Allure.

---

## Prerequisites

- **Node.js 18+** (20 LTS recommended)
- **Java JRE 8+** — *optional*, only needed to view Allure reports locally
- **Docker** — *optional*, only for containerized runs

No browser binaries are required — this is API-only testing, so `npx playwright install`
is intentionally never run.

---

## Project structure

```
api-test-framework/
├── .github/workflows/ci.yml     # CI pipeline
├── src/
│   ├── config/                  # typed, env-driven configuration
│   │   ├── environments.ts      # per-environment (non-secret) settings
│   │   └── index.ts             # loads .env, validates, exports `config`
│   ├── clients/
│   │   └── http-client.ts       # thin wrapper over Playwright's APIRequestContext
│   ├── models/                  # zod schemas + inferred types (DTOs)
│   │   ├── auth.model.ts
│   │   ├── booking.model.ts
│   │   └── index.ts
│   ├── services/                # one Service Object per API resource
│   │   ├── base.service.ts
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   └── index.ts
│   ├── builders/                # test-data builders (Builder + Factory)
│   │   ├── booking.builder.ts
│   │   └── index.ts
│   ├── fixtures/                # dependency injection + custom matchers
│   │   ├── test.fixtures.ts
│   │   ├── matchers.ts
│   │   └── index.ts
│   └── utils/
│       ├── logger.ts
│       └── schema-validator.ts
├── tests/
│   ├── health/ping.spec.ts
│   ├── auth/auth.spec.ts
│   └── booking/
│       ├── booking.read.spec.ts
│       ├── booking.create.spec.ts
│       ├── booking.update.spec.ts
│       └── booking.delete.spec.ts
├── .dockerignore
├── .env.example
├── .prettierrc
├── Dockerfile
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json
```

---

## Getting started

```bash
git clone <your-repo-url>
cd api-test-framework
npm ci
cp .env.example .env      # then fill in the values
npm test
```

---

## Configuration

Configuration is split into **non-secret settings** (committed) and **secrets** (never
committed).

- Per-environment settings live in `src/config/environments.ts` (`baseURL`, timeouts).
- Secrets and the active environment come from environment variables, listed in
  `.env.example`:

  | Variable         | Description                              | Example       |
  | ---------------- | ---------------------------------------- | ------------- |
  | `TEST_ENV`       | Which environment block to use           | `remote`      |
  | `ADMIN_USERNAME` | Auth username                            | `admin`       |
  | `ADMIN_PASSWORD` | Auth password                            | `password123` |

The same code reads these from three sources without any changes: a local `.env` file, CI
secrets, or Docker `-e` flags. Missing required variables fail fast at startup with a clear
message.

---

## Running tests

```bash
npm test                       # run everything
npm run test:smoke             # only @smoke tagged tests (fast critical path)
npm run test:regression        # only @regression tagged tests
TEST_ENV=remote npm test       # choose an environment
LOG_LEVEL=debug npm test       # verbose request logging
```

---

## Reporting

```bash
npm run report                 # open the built-in Playwright HTML report
npm run report:allure          # generate + serve the Allure report (requires Java)
npm run report:allure:generate # write a persistent allure-report/ folder
```

---

## Linting, formatting & type checking

```bash
npm run lint                   # ESLint
npm run lint:fix               # ESLint with autofix
npm run format                 # Prettier (write)
npm run format:check           # Prettier (check only)
npm run typecheck              # tsc --noEmit
```

A lint rule forbids importing `test`/`expect` directly from `@playwright/test` inside
`tests/` — always import them from `@fixtures` so fixtures and custom matchers are present.

---

## Docker (optional)

```bash
docker build -t api-test-framework .

docker run --rm \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=password123 \
  -e CI=true \
  -v "$PWD/allure-results:/app/allure-results" \
  -v "$PWD/playwright-report:/app/playwright-report" \
  api-test-framework
```

The image bundles Node and a Java runtime (for Allure). Credentials are injected at runtime;
secrets are never baked into the image.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request, in order:
**lint → type check → test**, then uploads the HTML report and Allure results as artifacts.
Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` as repository secrets
(Settings → Secrets and variables → Actions).

---

## Architecture overview

| Layer        | Responsibility                                                        |
| ------------ | --------------------------------------------------------------------- |
| `config`     | Typed, validated, environment-aware settings and secrets              |
| `clients`    | The single choke point for all HTTP (logging, timing, headers)        |
| `models`     | `zod` schemas that are both the runtime validators and the TS types   |
| `services`   | Per-resource intent (`getById`, `create`, …); return raw responses    |
| `builders`   | Valid, overridable test data                                          |
| `fixtures`   | Dependency injection, auth token, self-cleaning data factory, matchers|
| `tests`      | Verification only — arrange, act, assert                              |

**Key rule:** services *send* requests; tests *own* every assertion. This keeps negative
testing (403s, 404s) possible and keeps each layer single-purpose.

---

## Adding a new API resource

The architecture is designed so a new resource touches only leaf files — never the shared
infrastructure. To add resource `X`:

1. **Model** — add `src/models/x.model.ts` with `zod` schemas and inferred types; export it
   from `src/models/index.ts`.
2. **Service** — add `src/services/x.service.ts` extending `BaseService`; export it from
   `src/services/index.ts`.
3. **Builder** *(if the resource has a request body)* — add `src/builders/x.builder.ts`.
4. **Fixture** — add one line in `src/fixtures/test.fixtures.ts` to inject `xService`.
5. **Tests** — add `tests/x/*.spec.ts`.

You do **not** modify the HTTP client, config, logger, or matchers. That is the scalability
guarantee.

---

## Design patterns used

| Pattern                        | Where                         | Problem it solves                                  |
| ------------------------------ | ----------------------------- | -------------------------------------------------- |
| Layered architecture / SoC     | whole `src/` tree             | Each concern changes independently                 |
| Service Object Model           | `services/`                   | Endpoint knowledge lives in one place per resource |
| Dependency Injection           | `fixtures/`                   | Tests receive ready objects; no wiring boilerplate |
| Dependency Inversion / Facade  | `clients/http-client.ts`      | Services depend on our abstraction, not Playwright |
| Builder + Factory              | `builders/`, `aBooking()`     | Valid, varied data; tests state only what matters  |
| Single source of truth         | `models/` (`z.infer`)         | Types and validators can never drift apart         |
| Self-cleaning factory fixture  | `bookingFactory`              | Deterministic tests that leave no data behind      |
| Barrel exports                 | `index.ts` files              | Short, stable import paths                          |
| Fail-fast configuration        | `config/index.ts`            | Missing secrets error at startup, not mid-test     |
| Custom matcher extension       | `fixtures/matchers.ts`        | Domain-specific, high-signal failure messages      |
```
