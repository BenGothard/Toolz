import os
import requests
from typing import Optional, List, Dict

# Define the models to query. Update the endpoint URLs or tokens as needed.
MODELS: List[Dict[str, str]] = [
    {
        "name": "DeepSeek",
        "url": os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions"),
        "token": os.getenv("DEEPSEEK_TOKEN"),
    },
    {
        "name": "Mistral 7B Instruct",
        "url": os.getenv(
            "HF_MISTRAL_URL",
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        ),
        "token": os.getenv("HF_TOKEN"),
    },
]

HEADERS = {"Content-Type": "application/json"}


def query_model(model: Dict[str, str], prompt: str) -> Optional[str]:
    """Send the prompt to a model endpoint and return the text response."""
    url = model["url"]
    if not url:
        return None
    headers = dict(HEADERS)
    token = model.get("token")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    payload = {"inputs": prompt}
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code != 200:
            return None
        data = resp.json()
        # Hugging Face inference API returns a list of generated texts
        if isinstance(data, list):
            return data[0].get("generated_text")
        # DeepSeek-like API may return in a 'choices' list
        if isinstance(data, dict):
            if "choices" in data and data["choices"]:
                return data["choices"][0].get("message", {}).get("content")
            if "generated_text" in data:
                return data["generated_text"]
    except Exception:
        return None
    return None


def aggregate_answers(prompt: str) -> str:
    """Query each model until one returns a response."""
    for model in MODELS:
        text = query_model(model, prompt)
        if text:
            return text
    return "No models returned a response."
