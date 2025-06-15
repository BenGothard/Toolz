document.getElementById('search').addEventListener('click', async () => {
    const query = document.getElementById('query').value.trim();
    if (!query) {
        alert('Please enter a question.');
        return;
    }
    const answerEl = document.getElementById('answer');
    answerEl.textContent = 'Loading...';
    try {
        const resp = await fetch(`/query?q=${encodeURIComponent(query)}`);
        const data = await resp.json();
        answerEl.textContent = data.answer || data.error || 'No answer';
    } catch (e) {
        answerEl.textContent = 'Error contacting server.';
    }
});
