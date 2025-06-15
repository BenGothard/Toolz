# Toolz

Toolz is a collection of lightweight, AI-powered browser tools for crypto investors. Each tool is completely client-side and requires no dependencies or backend.

## Available Tools

- **Ponzology** – analyzes tokenomics descriptions for potentially predatory or unsustainable patterns, highlighting high APY claims and large team allocations. Visit [docs/ponzology](docs/ponzology/) to try it. When fetching tokenomics by contract address, Ponzology first queries Coingecko and falls back to CoinMarketCap's public API.

The project is designed so new tools can be added easily under the `docs/` directory. Simply create a folder for your tool containing an `index.html`, `style.css`, and `script.js`.
