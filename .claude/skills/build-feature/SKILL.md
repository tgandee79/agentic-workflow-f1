---
name: build-feature
description: Build one small feature in the F1 2025 app (page, component or lib function) with its unit test, story and e2e test, then check it with verify or gate. Use when asked to build, add, implement or change a feature here, and when `npm run build:loop` calls an agent.
---

# build-feature

One small feature, shipped with its tests, checked by the project's own scripts.
Paths are relative to the repo root.

## 1. Read before you write

- The task: the user's message, or the `Task:` section of the prompt.
- `CLAUDE.md`: conventions and the deterministic/delegated rule.
- The nearest existing example of what you are building, and copy its shape:
  - page: `src/pages/RacePage.tsx`, `RacePage.test.tsx`, `RacePage.stories.tsx`, `e2e/site.spec.ts`
  - logic: `src/lib/standings.ts` and `standings.test.ts`
  - data: `src/data/season.ts` (never the network, never edit `season-2025.json`)

Never read anything in `workshop/`. If the task is unclear, ask in interactive mode. Inside the loop, return `needs_human` (see section 4).

## 2. Write the code and its tests

| You add | You also add |
|---|---|
| Page `src/pages/XPage.tsx` | `XPage.test.tsx` (use `renderAt('/path')` from `@/test/render`), `XPage.stories.tsx` (decorator `withRouter(route, path)` from `@/test/story-router`), a test in `e2e/`, the route in `src/App.tsx`, the link in `navItems` in `src/components/Layout.tsx` |
| Component `src/components/X.tsx` | `X.test.tsx`, `X.stories.tsx` |
| Function in `src/lib/` | a `*.test.ts` next to it |

TypeScript is strict: no `any`. Team colours are hex values. Don't use official F1 or team logos.

To run only the files you touched while you work:

```bash
npx vitest run --project unit src/pages/RacePage.test.tsx
npx vitest run --project storybook src/pages/RacePage.stories.tsx
npx playwright test e2e/site.spec.ts
```

These are only for a quick check while you work. Only verify or gate (below) count as evidence.

## 3. Interactive mode (no loop in the prompt)

```bash
npm run -s verify -- --json
```

It prints `{ ok, passed, failed, results[] }` and writes `.agent/verify.json`. Each result is
`{ check, id, status, message }`, and `check` is one of lint, format, types, unit, stories, e2e.
It exits 1 when anything fails.

- Ignore `unit:src/lib/dates.test.ts::formatRaceDate keeps the circuit calendar date for a viewer in Los Angeles`.
  It fails on `main` on purpose. Do not fix it unless asked.
- Fix every other failure your change caused, and re-run verify.
- A `format:<file>` failure means run `npm run format`, not hand-editing.
- Report what you changed (files), then quote verify's numbers (`passed`, `failed`) and the ids of any failures still there.
  `CLAUDE.md` reserves "verified", "done" and "passing" for a `npm run gate` run in this session. Don't use those words for a verify run.

## 4. Inside a script-owned loop

The prompt says "You are inside a script-owned loop". The script owns the attempt counter, the
baseline, the retries and the tracker. You make **one** best change and return a verdict.

1. Do not count attempts, retry on your own, run `npm run baseline`, use git, or touch the tracker.
2. If the prompt lists the gate's NEW failures from the previous attempt, fix **only those**.
3. After editing, run these, in this order:

   ```bash
   npm run format
   npm run -s gate -- --json
   ```

   The gate prints `{ ok, newFailures[], preExisting[], fixed[], passed, visual }` and exits 1 only on new failures.
   The Los Angeles date test shows up in `preExisting`. Leave it there.

4. If `newFailures` is not empty, fix those ids and run the two commands again. That is still
   one attempt, not a retry. Stop when it's green, or when you can't see a fix.
5. Return the verdict. The script enforces its shape:
   - `ok`: the last gate run had `"ok": true`. Put the files you changed in `summary`, plus the gate's
     `passed` and `preExisting` counts.
   - `failed`: new failures remain. Put the failing ids in `summary`.
   - `needs_human`: the next step is a human's call (unclear requirement, a test that is
     wrong on purpose, a design choice). Put **one** question in `question`. Never ask in chat.

The script runs the gate itself, twice, after you return. Your `ok` is not taken on trust.

## Gotchas

- `e2e/site.spec.ts` counts rows: the calendar expects 25 rows and race 1 expects 21. A feature that adds or removes rows on those pages breaks it. Update the count only when that is the task.
- `src/components/Layout.test.tsx` finds nav links by name. When you add to `navItems`, use a label that doesn't clash with "Calendar".
- Prettier checks every file except `*.md`, `package-lock.json`, `src/data/season-2025.json`, `workshop/seed/` and `.agent/`. A new `.ts` or `.tsx` file that isn't formatted fails verify as `format:<file>`.
  In an interactive session, the PostToolUse hook in `.claude/settings.json` runs Prettier on every file you edit. `build:loop` turns all hooks off (`disableAllHooks` in `scripts/lib/agent.ts`), so inside the loop `npm run format` is still required.
- Files changed by Bash (heredocs, `sed`) don't trigger the hook. Use Edit or Write for source files, or run `npm run format`.
- Gate without a baseline exits 2 with "no .agent/baseline.json". In interactive mode, run `npm run baseline` once. The loop does it for you.
- A full verify takes about 11 s. While you iterate, use the targeted commands in section 2.
