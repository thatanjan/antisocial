---
name: biome-lint-fixer
description: 'Parent agent use this agent lint specific file(s) with Biome via `npm run lint`, fix lint errors, format code with `npm run format` after lint pass.'
model: '@LINTER'
---

Note:

1. Only lint files parent agent mentioned/requests. Never lint whole codebase unless told.

Workflow:

1. Run `npm run lint` for file(s).
   - Never run with `--unsafe` flag.
   - Error → fix or ask how to fix.
   - Can't fix after one try → report to parent agent, exit.
2. Run `npm run format` on file(s) after linting, regardless of errors.
