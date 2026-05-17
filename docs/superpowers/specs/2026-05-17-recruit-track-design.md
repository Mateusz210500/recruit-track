# Recruit-Track — Architecture & Roadmap

> Spec approved 2026-05-17. Phase 0 complete before Phase 1.

## Locked-in decisions

- **Persistence**: features call real `HttpClient` against `/api/applications`. A functional `mockApiInterceptor` (`HttpInterceptorFn`) in `core/interceptors/` intercepts those calls, simulates `delay(600)` + a configurable random 500 rate, and reads/writes `LocalStorage` directly under the key `recruit-track:applications`. No `StorageAdapter`, no repository abstraction — the HTTP contract is the seam.
- **Scope**: single-user, no auth, no backend.
- **Rendering**: SSR removed → pure SPA, zoneless (`provideZonelessChangeDetection`).
- **State**: Signals + `computed()` as source of truth. RxJS is a first-class citizen of the data flow (HTTP streams, search debounce, interceptor pipelines); bridged into the view via `toSignal()` with explicit `data` / `loading` / `error` signals.
- **Forms**: Reactive Forms wrapped with `model()` signals on form components.
- **Routing**: 100% functional — `Route[]`, functional guards/resolvers, lazy `loadChildren` per feature.
- **Styling**: Tailwind v4 + PostCSS; SCSS file kept only for Tailwind directives + custom variables.
- **Tests**: Vitest (already configured), AAA pattern, fakes over mocks, `.spec.ts` alongside source. No E2E in MVP.
- **DnD**: `@angular/cdk/drag-drop` (single approved dep).

## Target folder structure

```
src/app/
  core/                 singletons + cross-cutting
    interceptors/
      mock-api.interceptor.ts
      mock-api.interceptor.spec.ts
      mock-api.config.ts
    api-error.ts
    utils/
    tokens/
  shared/               dumb UI primitives (ui/, directives/, pipes/)
  layout/               app shell (shell/, sidebar/, topbar/)
  features/
    applications/
      data/
      ui/
      pages/
      applications.routes.ts
    settings/
      pages/, ui/, settings.routes.ts
  app.config.ts, app.routes.ts, app.ts
testing/                factories.ts, test helpers
docs/superpowers/specs/
```

## Data flow

Components read `ApplicationService` signals (`applications`, `isLoading`, `error`, computed selectors). The service calls `ApplicationsApi` (HttpClient). Requests hit `mockApiInterceptor`, which simulates latency/errors and persists to `LocalStorage`.

### Rules of the road

- Signals own view-state; RxJS bridged via `toSignal()`.
- Features never touch `LocalStorage` directly.
- Loading + error are first-class signals (see plan for `toSignal` + `map/startWith/catchError` pattern).
- `MOCK_API_CONFIG` token: `latencyMs` (600), `errorRate` (0.05), `storageKey` (`recruit-track:applications`).

## Testing strategy

- Vitest + jsdom via `@angular/build:unit-test`.
- Interceptor: drive via HttpClient, assert LocalStorage.
- ApplicationsApi: HttpTestingController (no interceptor).
- ApplicationService: fake ApplicationsApi with controllable Observables.
- Page components: `provideTestMockApi()` (latency=0, errorRate=0).

## Roadmap

| Phase | Scope |
|-------|--------|
| 0 | Foundations: no SSR, Tailwind, zoneless, HttpClient scaffold, folder structure |
| 1 | Domain & mock API: model, interceptor, ApplicationsApi, ApplicationService + specs |
| 2 | App shell & lazy routing |
| 3 | Kanban board + CDK drag-drop + loading/error UI |
| 4 | Search, filters, toast error UX (no keyboard shortcuts) |
| 5 | Dashboard with `@defer` |
| 6 | Settings: import/export, theme, confirm-dialog, demo sliders |
| 7 | Stretch: keyboard shortcuts, IndexedDB swap, PWA, Playwright |
