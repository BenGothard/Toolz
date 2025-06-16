# Toolz

Toolz is a collection of browser-native AI utilities. All models run in the user's browser using [Transformers.js](https://github.com/xenova/transformers.js) and browser APIs. No servers or API keys are required.

## Running Locally

Simply open `index.html` in any modern browser. For development you can run a simple server:

```bash
python3 -m http.server
```

## Using the Interface

1. Choose a tool from the drop-down menu on the page.
2. Enter or paste text into the input box.
3. Click **Run** to execute the selected agent.
4. Watch the status message under the selector for progress updates.
5. Results will appear in the output panel once the agent finishes.

## Adding Agents

Agents live in the `agents/` directory and register themselves via `registerAgent` from `js/agent_loader.js`.

## Deployment

Push the repository to GitHub and enable **GitHub Pages** in the repository settings. Ensure the `.nojekyll` file is present.

A GitHub Actions workflow is provided in `.github/workflows/deploy.yml`. The
workflow automatically deploys the `main` branch to GitHub Pages whenever you
push updates. Simply push the repository to GitHub and wait for the workflow to
finish before visiting your page.

## Privacy vs Performance

The checkbox on the main page toggles performance mode. When disabled, all agents run locally. When enabled, agents may opt to use cloud fallbacks.

## Contributing

Pull requests adding new agents or improving the UI are welcome.
