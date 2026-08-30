# Implementation Plans

- All implementation plans, technical designs, and execution plans must be created and stored in the `plans/` folder (e.g., `plans/<feature-name>.md` or `plans/YYYY-MM-DD-<topic>.md`).
- Always check `plans/` before starting new feature development or major refactoring tasks.

# graphify

- Before answering any codebase question, run `/graphify` (query the existing `graphify-out/` graph).
- After every code or doc change, run `/graphify --update` so the graph stays current.
- Full rebuild: `/graphify .`
