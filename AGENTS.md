# Implementation Plans

- All implementation plans, technical design docs, and feature execution plans must be stored in the `plans/` folder (e.g. `plans/<feature-name>.md` or `plans/YYYY-MM-DD-<topic>.md`).
- Always check `plans/` before starting multi-step tasks, and keep plans documented and updated there for persistent tracking across model sessions.

# graphify

- Before answering any codebase question, run `/graphify` (query the existing `graphify-out/` graph).
- After every code or doc change, run `/graphify --update` so the graph stays current.
- Full rebuild: `/graphify .`

