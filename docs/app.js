document.getElementById('search').addEventListener('click', async () => {
    const query = document.getElementById('query').value.trim();
    if (!query) {
        alert('Please enter a description.');
        return;
    }
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = 'Searching...';
    try {
        const resp = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`);
        if (!resp.ok) throw new Error('Request failed');
        const data = await resp.json();
        const items = data.items || [];
        if (!items.length) {
            resultsEl.innerHTML = '<li>No results found.</li>';
            return;
        }
        resultsEl.innerHTML = '';
        for (const repo of items) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = repo.html_url;
            a.textContent = `${repo.full_name} (${repo.stargazers_count}★)`;
            a.target = '_blank';
            li.appendChild(a);
            if (repo.description) {
                const p = document.createElement('p');
                p.textContent = repo.description;
                li.appendChild(p);
            }
            resultsEl.appendChild(li);
        }
    } catch (e) {
        resultsEl.innerHTML = '<li>Error fetching results.</li>';
    }
});
