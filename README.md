# Open Model Search

This project provides a simple search box that aggregates responses from several open source language models. You can run a small Flask server locally and query multiple models to get the best free answer to your question.

## Quick start

1. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set any API tokens for remote models (optional). For example:
   ```bash
   export HF_TOKEN=your_huggingface_token
   export DEEPSEEK_TOKEN=your_deepseek_token
   ```
3. Run the server:
   ```bash
   python server.py
   ```
4. Open `docs/index.html` in your browser and enter a question.

The server queries each configured model in sequence and returns the first successful response. You can modify `aggregator.py` to add more models or change the selection logic.
