# Superhuman CTA gallery button

## Goal

Add a new gallery card that faithfully recreates Superhuman's primary hero CTA as measured on 2026-08-31, with matching copyable HTML, React, and Node examples.

## Source measurements

- 212.16 × 50 px at desktop and mobile
- 12 px corner radius
- 16 px label at weight 460, with 16 px gap
- 6 px vertical/right padding and 16 px left padding
- 48 × 36 px gradient arrow tile with an 8 px radius
- Hover deepens the navy gradient and translates the arrow 4 px over 300 ms

## Execution

- [x] Add one failing contract test for the exported snippets and metadata.
- [x] Implement the native button, CSS, and copyable snippets.
- [x] Register the new card at the end of the gallery.
- [x] Run the focused test, full test suite, build, and browser QA in both themes.
- [x] Compare the local button against the measured source and record focused QA notes.

## Verification

- Focused Superhuman CTA test: passed.
- Production build: passed.
- Browser QA: passed in light and dark themes; hover translate measured at 4 px over 300 ms.
- Full suite: 116/116 tests passed. A no-content-change syntax repair added the missing string concatenation operators in the concurrently added XP-folder metadata so the shared production build could complete.
