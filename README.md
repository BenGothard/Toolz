# Toolz

Toolz is a collection of lightweight, AI-powered browser tools for crypto investors. Each tool is completely client-side and requires no dependencies or backend.

All pages support dark mode automatically via the user's system preference.

## Available Tools

- **Ponzology** – analyzes tokenomics descriptions for potentially predatory or unsustainable patterns, highlighting high APY claims, large team allocations and other irregularities. Visit [docs/ponzology](docs/ponzology/) to try it. When fetching tokenomics by contract address, Ponzology now pulls data from Coingecko, CoinMarketCap and the public Ethplorer API so supply information and basic metadata like holder counts are included alongside the description. The analysis checks for unrealistic supply numbers, missing max supply and other warning signs.

The project is designed so new tools can be added easily under the `docs/` directory. Simply create a folder for your tool containing an `index.html`, `style.css`, and `script.js`.
