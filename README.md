# Toolz

A collection of small AI utilities. The repository includes a simple web UI that can be hosted with GitHub Pages. The UI lets you describe a tool you want and uses OpenAI's API to generate a code snippet.

## Running the site

1. Place your files under the `docs/` directory so GitHub Pages can serve them.
2. Set your OpenAI API key in the browser by running the following in the dev console:

```javascript
localStorage.setItem('OPENAI_API_KEY', 'your-api-key');
```

3. Open `docs/index.html` in the browser (or enable GitHub Pages in the repo settings).
4. Type a description of the AI tool you'd like and click **Generate Tool**.
