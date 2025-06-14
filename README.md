# Toolz

A collection of small AI utilities. The repository includes a simple web UI that can be hosted with GitHub Pages. The rebuilt UI suggests code snippets from a small template library so no API key is required.

## Running the site

1. Place your files under the `docs/` directory so GitHub Pages can serve them.
2. Open `docs/index.html` in the browser (or enable GitHub Pages in the repo settings).
3. Type a description of the tool you'd like and click **Generate Tool** to see a matching code snippet.
4. Use the **Copy Code** button to quickly copy the snippet.

## Create a GitHub repository from your idea

1. Install Python and run `pip install transformers`.
2. Run the script:

   ```bash
   python generate_repo.py "my amazing idea"
   ```

3. The script builds a folder with example code using an open-source AI model.
4. To publish it on GitHub, open a terminal and run the commands printed at the end (they use the free `gh` command-line tool).
5. After pushing, visit the link shown and press **Fork** to copy it. Edit the files right on GitHub or clone them locally to keep building your app.

### From repository to working app (for kids)

1. Open your new repo on GitHub.
2. Click the file named `main.py`. Then press the pencil icon to edit.
3. Change the code or add new files. When you're done, press **Commit** at the bottom.
4. To run the app, clone it to your computer or use GitHub Codespaces. Follow the README in the repo for more details.

