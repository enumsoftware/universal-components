CSS Grid helpers: column and row templates, item placement, flow and implicit
track sizing.

Column tracks are generated as `repeat(n, minmax(0, 1fr))`, so a long word or a
wide child cannot blow a track past its share of the row. Gap uses the shared
spacing scale - see **Utilities / Spacing**.
