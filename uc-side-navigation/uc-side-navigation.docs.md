The component sizes itself from its parent container. Set a height on any parent
wrapper - `400px`, `60vh`, or a container query - and `uc-side-navigation` fills
that height.

On mobile (`max-width: 48rem`), the host and layout wrappers switch to `100dvh`
so the sidebar spans the full viewport height.

In `side` mode a closed sidebar is fully hidden and non-interactive: no pointer
events and nothing focusable inside it.
