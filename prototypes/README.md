# Prototypes

Static HTML, CSS and a little JavaScript. No build step, no external requests. Every path is relative, so the pages work on GitHub Pages:

| Page | Live link (once Pages is on) |
|---|---|
| Direction A, Clear Sleeve | https://muneebhash.github.io/Corpafly-theme/prototypes/direction-a/ |
| Direction B, Diamond Grid | https://muneebhash.github.io/Corpafly-theme/prototypes/direction-b/ |
| Direction C, Order Desk | https://muneebhash.github.io/Corpafly-theme/prototypes/direction-c/ |
| Code-built lanyards | https://muneebhash.github.io/Corpafly-theme/prototypes/shared/lanyard-demo.html |

## Folders

- `direction-a/`, `direction-b/`, `direction-c/`: one homepage each, with a `README.md` (the idea, what is glass, what moves, why it fits the buyers).
- `shared/`: the foundation all three use. Design tokens and glass classes (`tokens.css`), self-hosted OFL fonts (`fonts/`), the code-built lanyard (`lanyard.js`, `lanyard.css`), the catalogue with placeholder prices (`products.js`), and functional icons (`icons.svg`, Phosphor, MIT).
- `screens/`: screenshots at 1440 and 390 px wide. `*-fold.png` is the first screen; `*.jpg` is the full page.
- `DIRECTIONS-BRIEF.md`: the shared brief every direction was built from.

## Run locally

From the repo root: `python3 -m http.server 8765`, then open `http://127.0.0.1:8765/prototypes/direction-a/`. The pages use ES modules, so they need a server rather than `file://`.

Screenshots: `node tools/capture-screens.js http://127.0.0.1:8765 direction-a direction-b direction-c` (needs Playwright).
