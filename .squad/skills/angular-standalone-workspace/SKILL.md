---
name: "angular-standalone-workspace"
description: "Bootstrap an Angular 21 standalone workspace with Tailwind, ESLint, and test/build wiring from an empty repo."
domain: "frontend-setup"
confidence: "high"
source: "earned"
tools:
  - name: "powershell"
    description: "Run Angular CLI generation, dependency install, and validation commands."
    when: "When bootstrapping or validating the workspace."
---

## Context
Use this when the repository starts without Angular workspace files and the team needs a clean Angular 21 standalone baseline that is ready for feature work.

## Patterns
- Generate or mirror Angular CLI 21 workspace defaults, then tailor names and paths to the real repo root.
- Keep strict TypeScript enabled and wire standalone bootstrap through `src/main.ts`, `src/app/app.config.ts`, and `src/app/app.routes.ts`.
- Add Tailwind through `tailwind.config.js`, `postcss.config.js`, and global `src/styles.css`.
- Enable Angular ESLint early so `ng lint` exists before feature work starts.
- Keep the root component thin; reserve real screen composition for later feature tasks.

## Examples
- `package.json` scripts: `start`, `build`, `test`, `lint`
- `angular.json` targets: `build`, `serve`, `test`, `lint`
- Placeholder bootstrap host: `src/app/app.component.ts`

## Anti-Patterns
- Nesting the Angular app in a subfolder when the repo root is the intended workspace root.
- Skipping lint/test wiring and leaving later tasks to retrofit core workspace validation.
- Putting feature layout or domain logic into the bootstrap host during setup.
