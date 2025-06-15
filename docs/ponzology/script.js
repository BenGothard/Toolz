// Phrases that may signal questionable tokenomics.
// Each has an associated severity that feeds into the overall rating.
const redFlags = [
    { phrase: 'guaranteed returns', severity: 2 },
    { phrase: 'guaranteed profit', severity: 2 },
    { phrase: 'double your money', severity: 2 },
    { phrase: 'auto-staking', severity: 1 },
    { phrase: 'reflection rewards', severity: 1 },
    { phrase: 'whale tax', severity: 1 },
    { phrase: 'high apy', severity: 2 },
    { phrase: 'risk free', severity: 2 },
    { phrase: 'no risk', severity: 2 },
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

    // Check for simple phrase matches.
    redFlags.forEach(flag => {
        if (text.includes(flag.phrase)) {
            concerns.push(flag.phrase);
            severityTotal += flag.severity;
        }
    });

    // Detect extremely high APY/returns percentages.
    const apyMatch = text.match(/(\d{3,})%\s*(?:apy|apr|returns?)/);
    if (apyMatch && parseInt(apyMatch[1]) >= 1000) {
        concerns.push(apyMatch[0]);
        severityTotal += 2;
    }

    // Detect large team allocations (>=50%).
    const teamMatch = text.match(/(\d{1,3})%[^\.]{0,20}team/);
    if (teamMatch && parseInt(teamMatch[1]) >= 50) {
        concerns.push(teamMatch[0]);
        severityTotal += 2;
    }

    // Look for positive signs.
    const strengths = strengthFlags.filter(p => text.includes(p));

    // Determine rating based on number and severity of concerns.
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

    html += '<h3 class="rating ' + rating.toLowerCase() + '">Overall Rating: ' + rating + '</h3>';

    document.getElementById('results').innerHTML = html;
});
