# File Tree Explorer - Implementation & Testing Plan

**Project:** file-tree-explorer (Angular 21)
**Goal:** Build a professional, maintainable, signal-first file tree with full test coverage.

---

## 1. Current State Analysis

### What's already good
- `TreeService` uses modern signals (`signal`, `computed`)
- Decoupled architecture (service handles state, component is presentational)
- Drag & drop via CDK
- Recursive tree support
- `FileService` with `/api/files` fallback + localStorage persistence

### Issues / Gaps
- `FileTreeComponent` still uses legacy `@Input()` / `@Output()` decorators
- No unit tests for the component or service
- No test plan
- Icons were hardcoded (now fixed via `IconService`)
- No accessibility (ARIA) considerations yet
- No visual / integration tests

---

## 2. Signals Decision

**Recommendation: Yes — migrate to signal-based component inputs/outputs.**

### Why signals are the right choice here

| Aspect                    | Classic (`@Input`)      | Signals (`input()`)              | Winner    |
|---------------------------|-------------------------|----------------------------------|-----------|
| Performance (recursive tree) | Change detection runs on whole tree | Granular updates                 | Signals   |
| Angular 21+ best practice | Legacy                  | Recommended                      | Signals   |
| Template reactivity       | Requires `OnPush` + manual triggers | Automatic with `computed`        | Signals   |
| Testing                   | More boilerplate        | Cleaner with `TestBed`           | Signals   |
| Future-proofing           | Will be deprecated      | Current direction                | Signals   |

**Decision:** Convert `FileTreeComponent` to signal inputs.

- Use `input<FileNode[]>()`
- Use `output<void>()`
- Keep `TreeService` as the single source of truth (already signal-based)

---

## 3. Proposed Architecture (Signal-First)

```
src/app/
├── models/
│   └── file-node.model.ts          (already good)
├── services/
│   ├── tree.service.ts             (already uses signals - keep)
│   ├── file.service.ts             (good)
│   └── icon.service.ts             (new - done)
├── file-tree/
│   ├── file-tree.component.ts      (convert to signals)
│   ├── file-tree.component.html
│   ├── file-tree.component.scss
│   └── file-tree.component.spec.ts (new)
├── app.ts
└── app.config.ts
```

**Key rules going forward:**
- All state lives in `TreeService`
- `FileTreeComponent` becomes a **dumb, signal-based** presentational component
- Use `computed()` for derived values inside the component when needed
- Prefer `effect()` only for side effects (rarely needed here)

---

## 4. Testing Strategy

### Test Pyramid for this project

1. **Unit Tests** (highest priority)
   - `TreeService` (business logic, moveNode, toggle, persistence)
   - `IconService`
   - `FileTreeComponent` (rendering, drag events, icon output)

2. **Component Tests** (Angular TestBed + signals)
   - Test signal inputs
   - Test output emissions
   - Test recursive rendering

3. **Integration / E2E** (later)
   - Drag & drop across folders
   - API fallback behavior

### Recommended Tools (already available)
- Vitest (via `ng test`)
- Angular Testing Library patterns (or plain `TestBed`)
- Use `signal` testing helpers from `@angular/core/testing`

---

## 5. Implementation Phases

### Phase 1: Signals Migration (High Priority)
- [ ] Convert `FileTreeComponent` to use `input()` and `output()`
- [ ] Remove all `@Input` / `@Output` decorators
- [ ] Update parent (`app.ts`) to pass signals if needed
- [ ] Verify build + manual testing

### Phase 2: Test Coverage
- [ ] Create `file-tree.component.spec.ts`
- [ ] Create `tree.service.spec.ts`
- [ ] Create `icon.service.spec.ts`
- [ ] Achieve >80% coverage on services and component

### Phase 3: Professional Hardening
- [ ] Add ARIA attributes for accessibility (tree role, aria-expanded, etc.)
- [ ] Improve keyboard navigation
- [ ] Add loading / empty states
- [ ] Add proper error handling in `FileService`
- [ ] Consider virtual scrolling if tree can be very large (future)

### Phase 4: API & Persistence
- [ ] Improve `FileService` to better handle the flat `filepaths` API response
- [ ] Add proper transformation from flat paths → nested `FileNode[]`
- [ ] Add unit tests for the transformation logic

---

## 6. Signals Migration Example (Target)

```ts
// Before
@Input() nodes: FileNode[] = [];
@Output() treeChanged = new EventEmitter<void>();

// After (Angular 21+)
nodes = input<FileNode[]>([]);
treeChanged = output<void>();
```

This is the modern, recommended pattern.

---

## 7. Next Steps

1. Approve this plan
2. Start with **Phase 1** (signal migration of the component)
3. Then move to **Phase 2** (write tests)
4. We can create a `software-development/writing-plans` style task breakdown if needed

---

**Status:** Draft — ready for review and approval.
