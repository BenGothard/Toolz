// List of phrases that may indicate problematic tokenomics.
// Each phrase has an associated severity used for rating.
const redFlags = [
    { phrase: 'guaranteed returns', severity: 2 },
    { phrase: 'auto-staking', severity: 1 },
    { phrase: 'reflection rewards', severity: 1 },
    { phrase: '90% team', severity: 2 },
    { phrase: 'high apy', severity: 2 },
    { phrase: 'risk free', severity: 2 },
];

// Basic positive keywords to highlight potential strengths.
const strengthFlags = [
    'liquidity lock',
    'audited',
    'burn',
    'community',
];

// Run the analysis when the button is clicked.
document.getElementById('run').addEventListener('click', () => {
    const text = document.getElementById('tokenomics').value.toLowerCase();
    const concerns = [];
    let severityTotal = 0;

    // Check for red flag phrases.
    redFlags.forEach(flag => {
        if (text.includes(flag.phrase)) {
            concerns.push(flag.phrase);
            severityTotal += flag.severity;
        }
    });

    // Look for positive signs.
    const strengths = strengthFlags.filter(p => text.includes(p));

    // Determine rating based on number/severity of concerns.
    let rating = 'Green';
    if (severityTotal > 2 || concerns.length > 2) {
        rating = 'Red';
    } else if (severityTotal > 0) {
        rating = 'Yellow';
    }

    // Build result HTML.
    let html = '<h3>Summary</h3>';
    html += '<p>Automated check for potential ponzi indicators.</p>';

    html += '<h3>Strengths</h3>';
    if (strengths.length) {
        html += '<ul>' + strengths.map(s => '<li>' + s + '</li>').join('') + '</ul>';
    } else {
        html += '<p>None noted.</p>';
    }

    html += '<h3>Concerns</h3>';
    if (concerns.length) {
        html += '<ul>' + concerns.map(c => '<li>' + c + '</li>').join('') + '</ul>';
    } else {
        html += '<p>No major red flags found.</p>';
    }

    html += '<h3>Overall Rating: ' + rating + '</h3>';

    document.getElementById('results').innerHTML = html;
});
