const snippets = [
    {
        keywords: ['summarize', 'summary'],
        code: `# Python text summarizer\nfrom gensim.summarization import summarize\ntext = "Your text here"\nprint(summarize(text))`
    },
    {
        keywords: ['translate', 'translation'],
        code: `# Python text translator\nfrom googletrans import Translator\ntranslator = Translator()\nresult = translator.translate("Hello world", dest='es')\nprint(result.text)`
    },
    {
        keywords: ['fibonacci'],
        code: `# Python Fibonacci sequence\nn = 10\nfib = [0, 1]\nfor i in range(2, n):\n    fib.append(fib[-1] + fib[-2])\nprint(fib)`
    }
];

document.getElementById('generate').addEventListener('click', () => {
    const prompt = document.getElementById('prompt').value.toLowerCase();
    if (!prompt.trim()) {
        alert('Please enter a description.');
        return;
    }
    const resultEl = document.getElementById('result');
    const match = snippets.find(snippet => snippet.keywords.some(k => prompt.includes(k)));
    if (match) {
        resultEl.textContent = match.code;
    } else {
        resultEl.textContent = '# Example Python script\nprint("Hello, world!")';
    }
});
