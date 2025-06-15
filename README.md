# Toolz

[![GitHub Pages](https://img.shields.io/github/deployments/BenGothard/Toolz/github-pages?label=deploy)](https://github.com/BenGothard/Toolz/actions/workflows/pages.yml)
[![MIT License](https://img.shields.io/github/license/BenGothard/Toolz)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/BenGothard/Toolz?style=social)](https://github.com/BenGothard/Toolz/stargazers)

Toolz is a collection of lightweight, AI-powered browser tools for crypto investors. Each tool is completely client-side and requires no dependencies or backend.

All pages support dark mode automatically via the user's system preference.

![Ponzology Demo](docs/toolz/ponzology/demo.gif)

## Available Tools

- **Ponzology** – analyzes tokenomics descriptions for potentially predatory or unsustainable patterns, highlighting high APY claims, large team allocations and other irregularities. Visit [docs/toolz/ponzology](docs/toolz/ponzology/) to try it. When fetching tokenomics by contract address, $CASHTAG or project name, Ponzology first tries your browser's AI search to find the most relevant token. If that fails, it falls back to Coingecko, CoinMarketCap and the public Ethplorer API so supply information and basic metadata like holder counts are included alongside the description. The analysis checks for unrealistic supply numbers, missing max supply and other warning signs.

The project is designed so new tools can be added easily under the `docs/` directory. Simply create a folder for your tool containing an `index.html`, `style.css`, and `script.js`.

The site is served from the `/toolz` path on GitHub Pages.
