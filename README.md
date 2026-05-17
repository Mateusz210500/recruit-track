# RecruitTrack

**Enterprise-grade, single-user CRM for software engineers to track job applications — built with cutting-edge Angular.**

RecruitTrack is a deliberate showcase of modern Angular architecture: a pure SPA with no SSR baggage, no fake backend server, and no repository indirection. Features speak HTTP; persistence and latency live behind a functional interceptor seam. The UI is zoneless, signal-driven, and tested with Vitest using fakes instead of brittle mocks.

---

## Key Architectural Highlights

### Pure Zoneless Architecture

Zone.js is gone. The app boots with `provideZonelessChangeDetection()`, so change detection is explicit and granular — driven by signal reads, not a global monkey patch around the browser event loop.

**Why this matters:**

- **Predictable performance** — updates propagate only where signals are consumed, not across the entire component tree on every async tick.
- **Smaller runtime** — no Zone.js polyfill or patching of `setTimeout`, `Promise`, or DOM events.
- **Signals as the view contract** — components and services expose `computed()` selectors (`applications`, `isLoading`, `error`, `applicationsByStatus`) that templates read directly. No `ChangeDetectorRef.markForCheck()`, no `async` pipe gymnastics.

```typescript
// app.config.ts — zoneless + functional HTTP stack
provideZonelessChangeDetection(),
provideHttpClient(withInterceptors([mockApiInterceptor])),
```

### Functional Mock Interceptor (The HTTP Seam)

We did **not** build a Node mock server or a `StorageAdapter` abstraction. Features call a real `ApplicationsApi` over `HttpClient` (`GET/POST/PATCH/DELETE` on `/api/applications`). A single `HttpInterceptorFn` — `mockApiInterceptor` — owns persistence, latency, and fault injection.

**Why this matters:**

- **Feature decoupling** — `ApplicationService` and UI code never touch `localStorage`. The HTTP contract is the only seam; swapping to a REST backend means removing the interceptor, not rewriting features.
- **Production-shaped code** — DTOs, status codes (`404`, `405`, `500`), and RxJS error paths mirror a real API. The app is API-ready on day one.
- **Network-level persistence** — reads/writes go through `localStorage` under `recruit-track:applications`, with seed data on first access. Configurable via `MOCK_API_CONFIG`: `latencyMs` (600), `errorRate` (0.05), `storageKey`.
- **Testable infrastructure** — interceptor specs drive `HttpClient` end-to-end and assert storage side effects in isolation (per-test `storageKey` UUID).

```typescript
// Features never import localStorage — only HttpClient
list(): Observable<Application[]> {
  return this.http.get<Application[]>(this.baseUrl);
}
```

### RxJS & Signals Convergence

RxJS and Signals are not competing stacks — they have distinct jobs:

| Layer | Tool | Responsibility |
|-------|------|----------------|
| I/O & streams | **RxJS** | HTTP requests, interceptor `delay`/`switchMap`, refresh triggers (`Subject`), optimistic `move()` pipelines |
| View state | **Signals** | `computed()` selectors, optimistic UI overlay, client-side filter query |
| Bridge | **`toSignal()`** | Collapse async load lifecycle into a discriminated `LoadState` union |

`ApplicationService` is the convergence point: a `refresh$` subject fans into `switchMap(() => api.list())`, wrapped with `startWith(loading)` and `catchError` → `ApiError`, then bridged via `toSignal()`. Templates consume `isLoading()`, `error()`, and `applications()` — never a raw `Observable`.

```typescript
private readonly loadState = toSignal(
  merge(of(undefined), this.refresh$.pipe(map(() => undefined))).pipe(
    switchMap(() =>
      this.api.list().pipe(
        map((data): LoadState => ({ status: 'success', data })),
        startWith({ status: 'loading' }),
        catchError((error) => of({ status: 'error', error: ApiError.from(error) })),
      ),
    ),
  ),
  { initialValue: { status: 'loading' } },
);

readonly isLoading = computed(() => this.loadState().status === 'loading');
readonly applications = computed(() => /* optimistic overlay + success data */);
```

Search and filter debouncing (RxJS `debounceTime` on input streams) are planned for Phase 4; the signal-based `filtered` computed already owns client-side query state.

### Declarative Loading & Error States

Templates use Angular's built-in control flow — `@if`, `@else if`, `@for` — bound directly to service signals. No `async` pipe, no subscription management in components, no imperative `*ngIf` with observables.

The Kanban board is the reference implementation:

```html
@if (service.isLoading()) {
  <!-- accessible loading shell -->
} @else if (service.error(); as loadError) {
  <!-- error surface with retry → service.reload() -->
} @else {
  @for (status of statuses; track status) {
    <app-kanban-column … />
  }
}
```

**`@defer`** is reserved for non-critical views (dashboard analytics, charts) so initial navigation stays lean — load heavy UI only when the user reaches it. This follows the same signal-first philosophy: defer blocks render subtrees, not hide loading state behind pipes.

---

## Project Architecture

DDD-lite folder layout. Cross-cutting concerns live in `core/`; features are vertically sliced and lazy-loaded.

```
src/app/
├── core/                          # Singletons & cross-cutting
│   ├── interceptors/
│   │   ├── mock-api.interceptor.ts   # HttpInterceptorFn — persistence + latency
│   │   └── mock-api.config.ts        # MOCK_API_CONFIG injection token
│   ├── api-error.ts
│   ├── utils/
│   └── tokens/
├── shared/                        # Dumb, reusable UI (ui/, directives/, pipes/)
├── layout/                        # App shell (shell/, sidebar/, topbar/)
├── features/
│   ├── applications/
│   │   ├── data/                  # Model, API client, ApplicationService, order logic
│   │   ├── ui/                    # application-card, application-form, status-pill
│   │   ├── pages/                 # kanban/, dashboard/
│   │   └── applications.routes.ts # Lazy Route[] per page
│   └── settings/
│       ├── pages/, ui/
│       └── settings.routes.ts
├── app.config.ts                  # Zoneless bootstrap + router + HTTP
└── app.routes.ts                  # Shell + loadChildren per feature

testing/                           # buildApplication() factories, test-bed helpers
docs/superpowers/specs/            # Architecture spec & roadmap
```

**Conventions:**

- **Features** own their routes, pages, data layer, and presentational UI. No feature imports another feature's internals.
- **`data/`** holds services, models, and API clients; **`ui/`** holds standalone, dumb components; **`pages/`** compose them.
- **Routing** is 100% functional — `Route[]`, `loadComponent` / `loadChildren`, no NgModules.
- **Styling** — Tailwind CSS v4 + PostCSS; SCSS only for Tailwind directives and design tokens.

---

## Testing Strategy

| Target | Approach |
|--------|----------|
| **Runner** | Vitest + jsdom via `@angular/build:unit-test` |
| **Style** | Arrange–Act–Assert; `.spec.ts` colocated with source |
| **Philosophy** | **Fakes over mocks** — controllable `Subject` streams, not `jest.fn()` spaghetti |

**Interceptor tests** — configure `provideTestMockApi({ storageKey })` with `latencyMs: 0` and `errorRate: 0`, drive real `HttpClient` calls, assert `localStorage` contents and HTTP status codes (including forced `500` when `errorRate: 1`).

**`ApplicationsApi` tests** — `HttpTestingController` without the interceptor; verify URL shapes and payloads in isolation.

**`ApplicationService` tests** — `provideFakeApplicationsApi({ list: () => list$ })` with a manual `Subject` to simulate loading → success → error transitions; assert `isLoading()`, `applications()`, `applicationsByStatus()`, and optimistic `move()` rollback.

**Component / page tests** — `renderWithProviders()` + `provideTestMockApi()` for integration-level specs (Kanban columns, forms, cards) with deterministic, zero-latency API behavior.

```typescript
// testing/test-bed.ts — isolated storage per test run
provide: MOCK_API_CONFIG,
useValue: {
  ...DEFAULT_MOCK_API_CONFIG,
  latencyMs: 0,
  errorRate: 0,
  storageKey: `test-${crypto.randomUUID()}`,
},
```

Factories in `testing/factories.ts` (`buildApplication()`) keep test data consistent and readable.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Angular 21 (standalone components, signals, functional APIs) |
| Change detection | Zoneless (`provideZonelessChangeDetection`) |
| HTTP | `HttpClient` + `HttpInterceptorFn` mock seam |
| State | Signals + `computed()` + `toSignal()` bridge |
| Drag & drop | `@angular/cdk/drag-drop` |
| Styling | Tailwind CSS v4 |
| Unit tests | Vitest |
| Scope | Single-user SPA — no auth, no backend |

---

## Getting Started

**Prerequisites:** Node.js 20+ and npm 11+

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4200
npm start

# Run unit tests (Vitest via Angular CLI)
npm test

# Production build
npm run build
```

On first load, the mock interceptor seeds sample applications into `localStorage` under `recruit-track:applications`. Open DevTools → Application → Local Storage to inspect or reset state.

---

## Roadmap (High Level)

| Phase | Focus |
|-------|--------|
| 0 ✅ | Zoneless SPA, Tailwind, HTTP scaffold, folder structure |
| 1 ✅ | Domain model, mock interceptor, `ApplicationsApi`, `ApplicationService` |
| 2 ✅ | App shell, lazy routing |
| 3 ✅ | Kanban + CDK drag-drop + loading/error UI |
| 4 | Search debounce, filters, toast error UX |
| 5 | Dashboard with `@defer` |
| 6 | Settings: import/export, theme, demo sliders |
| 7 | Stretch: keyboard shortcuts, IndexedDB swap, PWA, Playwright |

Full spec: [`docs/superpowers/specs/2026-05-17-recruit-track-design.md`](docs/superpowers/specs/2026-05-17-recruit-track-design.md)

---

## License

Private project — not published to npm.
