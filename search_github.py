import os
import sys
import requests

API_URL = "https://api.github.com/search/repositories"


def search_github(query, per_page=5):
    """Search GitHub repositories matching the query."""
    headers = {"Accept": "application/vnd.github+json"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    params = {
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": per_page,
    }

    resp = requests.get(API_URL, headers=headers, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json().get("items", [])


def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = input("Describe your tool idea: ").strip()
    if not query:
        print("No query provided.")
        return

    try:
        results = search_github(query)
    except requests.HTTPError as e:
        print(f"HTTP error: {e}")
        return
    except Exception as e:
        print(f"Error: {e}")
        return

    if not results:
        print("No repositories found.")
        return

    print(f"Top {len(results)} results for '{query}':\n")
    for repo in results:
        name = repo["full_name"]
        url = repo["html_url"]
        stars = repo["stargazers_count"]
        desc = repo.get("description", "")
        print(f"- {name} ({stars} ★)\n  {url}\n  {desc}\n")


if __name__ == "__main__":
    main()
