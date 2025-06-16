# Toolz

Toolz is a collection of browser-native AI utilities. All models run in the user's browser using [Transformers.js](https://github.com/xenova/transformers.js) and browser APIs. No servers or API keys are required.

## Running Locally

Simply open `index.html` in any modern browser. For development you can run a simple server:

```bash
python3 -m http.server
```

## Adding Agents

Agents live in the `agents/` directory and register themselves via `registerAgent` from `js/agent_loader.js`.

## Deployment

Push the repository to GitHub and enable **GitHub Pages** in the repository settings. Ensure the `.nojekyll` file is present.

## Privacy vs Performance

The checkbox on the main page toggles performance mode. When disabled, all agents run locally. When enabled, agents may opt to use cloud fallbacks.

## Contributing

Pull requests adding new agents or improving the UI are welcome.
