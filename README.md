# Toolz

Toolz helps you discover free open source technology for your project ideas. Type a description of the tool you want and Toolz searches GitHub for popular repositories that match your keywords.

This repository includes a small web interface (served from the `docs/` folder) and a command-line script, `search_github.py`, that uses the GitHub search API.

## Web interface
Open `docs/index.html` in your browser or enable GitHub Pages to host the site. The repository includes a workflow that publishes the `docs/` directory to GitHub Pages whenever changes are pushed to `main`. Once Pages is enabled, your site will be available at `https://<username>.github.io/Toolz/`.
Enter your idea in the search box and the page will list the top GitHub projects related to it.

## Command-line usage
1. Install the dependencies:
   ```bash
   pip install requests
   ```
2. Run the script with your query:
   ```bash
   python search_github.py "static site generator"
   ```
   The script prints links to relevant repositories.

Set the `GITHUB_TOKEN` environment variable to use an API token (optional but recommended to avoid rate limits).
