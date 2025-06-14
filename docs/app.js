document.getElementById('generate').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    if (!prompt.trim()) {
        alert('Please enter a description.');
        return;
    }

    const apiKey = localStorage.getItem('OPENAI_API_KEY');
    if (!apiKey) {
        alert('Set your OpenAI API key in localStorage under OPENAI_API_KEY.');
        return;
    }

    const resultEl = document.getElementById('result');
    resultEl.textContent = 'Generating...';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an assistant that creates simple AI tool code snippets.' },
                    { role: 'user', content: prompt }
                ]
            })
        });
        const data = await response.json();
        const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        resultEl.textContent = text || 'No response';
    } catch (err) {
        console.error(err);
        resultEl.textContent = 'Error retrieving response.';
    }
});
