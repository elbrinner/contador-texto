---
name: "contract-first-missing-dependency"
description: "Capture pending tests that lock expected behavior when the target implementation or dependency contract has not landed yet."
domain: "testing"
confidence: "medium"
source: "earned"
tools:
  - name: "apply_patch"
    description: "Create the pending spec and supporting team notes."
    when: "When a task depends on code that is not present in the workspace yet."
  - name: "powershell"
    description: "Run the existing test command to verify the pending suite integrates cleanly."
    when: "After adding the placeholder coverage."
---

## Context
Use this when a testing task is assigned before the implementation exists, but the team still needs the expected contract documented in executable form.

## Patterns
- Prefer `it.todo(...)` or an equivalent pending primitive over inventing a fake public API.
- Phrase each pending case around responsibilities, boundaries, and user-visible outcomes.
- Keep the suite narrow: document the orchestration contract, the critical edge cases, and the extension boundary.
- Pair the spec with a short team note that explains why the suite is pending and what the implementation owner must supply next.

## Examples
- Missing orchestration service: pending tests for normalization delegation, token estimation delegation, zero-state handling, and immutable input handling.
- Missing adapter or integration seam: pending tests for error mapping, retry behavior, and typed output shape.

## Anti-Patterns
- Writing passing tests that assert only file existence or other trivia.
- Hard-coding speculative method names or constructor dependencies that the implementation has not agreed to yet.
- Leaving the pending suite undocumented so the next owner cannot tell whether the gap is intentional.
