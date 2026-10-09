# Sara Rostami · portfolio

Personal portfolio for academia **and** industry: Neuroscience × Machine Learning.

A static site (plain HTML, CSS and JavaScript, no build step) served by GitHub Pages.

## The idea: one site, two branches

The hero graphic is a career "fork": a computer-engineering trunk that splits into
**Academia** (neuroscience, NeuroAI) and **Industry** (LLMs, agents, trustworthy AI).
Visitors pick a branch, or use the **All / Academia / Industry** switch in the header, and the page tailors itself:

| | Academia | Industry |
|---|---|---|
| About | research bio highlighted | applied-AI bio highlighted |
| Section order | Research program → Publications → Projects … | Applied AI → Projects → Experience … |
| Projects filter | research projects | applied projects |
| Primary download | Academic CV | Résumé |

### Shareable, tailored links

Send a link that opens already tailored:

- Professors and labs: `https://sararostami.github.io/portfolio/?lens=academia`
- Recruiters: `https://sararostami.github.io/portfolio/?lens=industry`
- A single project: `https://sararostami.github.io/portfolio/#vlm-calibration` (any project `id` works)

## Editing content

| What | Where |
|---|---|
| Projects, experience, education, publications, awards, teaching, sectors | `assets/js/data.js` |
| Bios, research themes, the AI-stack diagram, contact | `index.html` |
| Colours, fonts, layout | `assets/css/style.css` (tokens at the top) |
| Interactive figures in project dialogs | `assets/js/viz.js` |
| Résumé / CV / certificates | `files/` |

**Add a project:** copy an entry in `SITE.projects` in `data.js`, give it a unique `id`,
set `tracks` to `["academia"]`, `["industry"]` or both, and point `image` at an SVG/PNG.
`featured: true` makes it a large card. The grid balances its rows automatically.

## Illustrations

The project artwork in `assets/img/projects/` is generated:

```bash
python3 tools/generate_illustrations.py assets/img/projects
```

Edit the matching function in that script to change a drawing. Any 16:10 image also works.

## Preview locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Publishing

1. **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
2. The site goes live at `https://sararostami.github.io/portfolio/`.

When you're ready to make this your main site, copy these files into the
`SaraRostami.github.io` repository (replacing the Jekyll site), then update the
`og:image` / `og:url` addresses in `index.html` to drop `/portfolio`.
