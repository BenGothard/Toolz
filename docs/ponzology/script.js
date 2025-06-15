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
    { phrase: 'multi level marketing', severity: 2 },
    { phrase: 'mlm', severity: 2 },
    { phrase: 'referral bonus', severity: 1 },
    { phrase: 'infinite mint', severity: 2 },
    { phrase: 'no max supply', severity: 2 },
];

// Basic positive keywords to highlight potential strengths.
const strengthFlags = [
    'liquidity lock',
    'audited',
    'burn',
    'community',
];

// Combine description with basic supply info into a single text block
// Build combined text from description, supply details and any extra metadata.
function buildTokenomicsText(desc, supply, meta) {
    let text = '';
    if (desc) {
        text += desc.trim();
    }
    const lines = [];
    if (supply) {
        if (supply.circulating) lines.push(`Circulating Supply: ${supply.circulating}`);
        if (supply.total) lines.push(`Total Supply: ${supply.total}`);
        if (supply.max) lines.push(`Max Supply: ${supply.max}`);
    }
    if (meta) {
        if (meta.holders) lines.push(`Holders: ${meta.holders}`);
        if (meta.decimals) lines.push(`Decimals: ${meta.decimals}`);
        if (meta.website) lines.push(`Website: ${meta.website}`);
    }
    if (lines.length) {
        if (text) text += '\n\n';
        text += lines.join('\n');
    }
    return text;
}

// Fetch tokenomics text from Coingecko using a contract address. If that fails,
// try the public CoinMarketCap API.
document.getElementById('fetch').addEventListener('click', () => {
    const addr = document.getElementById('contract').value.trim();
    if (!addr) return;

    const tokenomicsEl = document.getElementById('tokenomics');

    const fetchEthplorer = () => {
        return fetch(`https://api.ethplorer.io/getTokenInfo/${addr}?apiKey=freekey`)
            .then(r => { if (!r.ok) throw new Error('api error'); return r.json(); })
            .then(data => ({
                meta: {
                    name: data.name,
                    symbol: data.symbol,
                    decimals: data.decimals,
                    holders: data.holdersCount,
                    website: data.website,
                },
                supply: {
                    total: data.totalSupply,
                },
            }))
            .catch(() => ({}));
    };

    // Helper to query CoinMarketCap when Coingecko has no info
    const tryCoinMarketCap = (slug) => {
        if (!slug) {
            alert('Token description not found');
            return;
        }

        fetch(`https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?slug=${slug}`)
            .then(r => {
                if (!r.ok) throw new Error('api error');
                return r.json();
            })
            .then(data => {
                const root = data.data || {};
                const desc = root.description;
                const sd = root.supplyDetails || {};
                const supply = {
                    circulating: sd.circulatingSupply && sd.circulatingSupply.value,
                    total: sd.totalSupply && sd.totalSupply.value,
                    max: sd.maxSupply && sd.maxSupply.value,
                };
                fetchEthplorer().then(extra => {
                    const text = buildTokenomicsText(desc, { ...supply, ...extra.supply }, extra.meta);
                    if (text) {
                        tokenomicsEl.value = text;
                    } else {
                        alert('Token description not found');
                    }
                });
            })
            .catch(() => {
                alert('Failed to fetch tokenomics');
            });
    };

    fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${addr}`)
        .then(r => {
            if (!r.ok) throw new Error('api error');
            return r.json();
        })
        .then(data => {
            const desc = data.description && data.description.en;
            const slug = data.id;
            const market = data.market_data || {};
            const supply = {
                circulating: market.circulating_supply,
                total: market.total_supply,
                max: market.max_supply,
            };
            fetchEthplorer().then(extra => {
                const text = buildTokenomicsText(desc, { ...supply, ...extra.supply }, extra.meta);
                if (text) {
                    tokenomicsEl.value = text;
                } else {
                    tryCoinMarketCap(slug);
                }
            });
        })
        .catch(() => {
            // If the Coingecko request fails entirely we don't know the slug,
            // so tokenomics cannot be fetched.
            alert('Failed to fetch tokenomics');
        });
});

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

    // Parse basic supply and metadata lines for additional checks
    const parseNum = (match) => match && parseInt(match[1].replace(/,/g, ''));
    const totalSupply = parseNum(text.match(/total supply:\s*([\d,]+)/));
    const maxSupply = parseNum(text.match(/max supply:\s*([\d,]+)/));
    const holders = parseNum(text.match(/holders:\s*([\d,]+)/));
    const decimals = parseNum(text.match(/decimals:\s*(\d+)/));

    if (totalSupply && totalSupply > 1e12) {
        concerns.push('very large total supply');
        severityTotal += 1;
    }
    if (maxSupply !== undefined) {
        if (totalSupply && totalSupply > maxSupply) {
            concerns.push('total supply exceeds max supply');
            severityTotal += 2;
        }
    } else {
        concerns.push('no maximum supply');
        severityTotal += 1;
    }
    if (holders && holders < 50) {
        concerns.push('very few holders');
        severityTotal += 1;
    }
    if (decimals && decimals > 18) {
        concerns.push('unusual decimals');
        severityTotal += 1;
    }

    // Look for positive signs.
    const strengths = strengthFlags.filter(p => text.includes(p));

    // Determine rating based on number and severity of concerns.
    let rating = 'Green';
    if (severityTotal > 3 || concerns.length > 3) {
        rating = 'Red';
    } else if (severityTotal > 1 || concerns.length > 1) {
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
