import { $, cacheFetch, toggleTheme } from '../../util.js';

const textEl = $('#text');
const runBtn = $('#run');
const searchBtn = $('#search');
const contractEl = $('#contract');
const resultsEl = $('#results');
const spinner = $('#spinner');
$('#theme-toggle').addEventListener('click', toggleTheme);

const patterns = [
 /high\s+apy/i,
 /guaranteed\s+returns/i,
 /auto[-\s]?staking/i,
 /reflection\s+rewards/i,
 /> ?90% .*team/i,
 /no\s+vesting/i,
 /mint\s+function/i,
 /burn\s+to\s+earn/i,
 /referral/i,
 /mlm/i,
/locked\s+liquidity\s+forever/i
];

function isLikelyMatch(token,q){
 if(!token) return false;
 if(token.symbol && token.symbol.toLowerCase()===q) return true;
 if(token.name && token.name.toLowerCase()===q) return true;
 if(token.name && token.name.toLowerCase().includes(q)) return true;
 return false;
}

async function validateTokenMatch(addr, term){
 try{
  const data=await cacheFetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${addr}`);
  const q=term.replace(/^\$/,'').toLowerCase();
  if(data.symbol && data.symbol.toLowerCase()===q) return true;
  if(data.name && data.name.toLowerCase().includes(q)) return true;
 }catch(e){}
 return false;
}

async function aiSearchToken(term){
 if(typeof navigator!=='undefined' && navigator.search && navigator.search.query){
  try{
   const result=await navigator.search.query({text:term});
   if(result && result.tokens && result.tokens.length){
    const q=term.replace(/^\$/,'').toLowerCase();
    const token=result.tokens.find(t=>isLikelyMatch(t,q));
    if(token && token.contractAddress){
     if(await validateTokenMatch(token.contractAddress,term)) return token.contractAddress;
    }
   }
  }catch(e){/* ignore AI search failures */}
 }
 return null;
}


function buildTokenomicsText(desc,supply,meta){
 let text='';
 if(desc) text+=desc.trim();
 const lines=[];
 if(supply){
  if(supply.circulating) lines.push(`Circulating Supply: ${supply.circulating}`);
  if(supply.total) lines.push(`Total Supply: ${supply.total}`);
  if(supply.max) lines.push(`Max Supply: ${supply.max}`);
 }
 if(meta){
  if(meta.holders) lines.push(`Holders: ${meta.holders}`);
  if(meta.decimals) lines.push(`Decimals: ${meta.decimals}`);
  if(meta.website) lines.push(`Website: ${meta.website}`);
 }
 if(lines.length){
  if(text) text+='\n\n';
  text+=lines.join('\n');
 }
 return text;
}

async function search(){
 let query=contractEl.value.trim();
 if(!query) return;
 searchBtn.disabled=true; spinner.hidden=false;
 let addr=query;
 if(!/^0x[a-fA-F0-9]{40}$/.test(query)){
  addr=await aiSearchToken(query);
  if(!addr){
   const sym=query.replace(/^\$/,'').toLowerCase();
   try{
    const search=await cacheFetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(sym)}`);
    const coin=(search.coins||[]).find(c=>c.symbol.toLowerCase()===sym || c.name.toLowerCase()===sym || c.name.toLowerCase().includes(sym));
    if(!coin){
     alert('Token not found'); spinner.hidden=true; searchBtn.disabled=false; return;
    }
    const data=await cacheFetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
    addr=data.platforms&&data.platforms.ethereum;
    if(!addr){
     const market=data.market_data||{};
     const supply={circulating:market.circulating_supply,total:market.total_supply,max:market.max_supply};
     const meta={name:data.name,symbol:data.symbol,decimals:data.detail_platforms&&data.detail_platforms.ethereum&&data.detail_platforms.ethereum.decimal_place,website:data.links&&data.links.homepage&&data.links.homepage[0]};
     const desc=data.description&&data.description.en;
     const text=buildTokenomicsText(desc,supply,meta);
     if(text) textEl.value=text; else alert('Token description not found');
     spinner.hidden=true; searchBtn.disabled=false; return;
    }
   }catch(e){alert('Failed to fetch token info'); spinner.hidden=true; searchBtn.disabled=false; return;}
  }
 }
 const fetchEthplorer=async()=>{
  try{
   const data=await cacheFetch(`https://api.ethplorer.io/getTokenInfo/${addr}?apiKey=freekey`);
   return{meta:{name:data.name,symbol:data.symbol,decimals:data.decimals,holders:data.holdersCount,website:data.website},supply:{total:data.totalSupply}};
  }catch(e){return{};}
 };
 const tryCoinMarketCap=async(slug)=>{
  if(!slug){alert('Token description not found');return;}
  try{
   const data=await cacheFetch(`https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?slug=${slug}`);
   const root=data.data||{};
   const desc=root.description;
   const sd=root.supplyDetails||{};
   const supply={circulating:sd.circulatingSupply&&sd.circulatingSupply.value,total:sd.totalSupply&&sd.totalSupply.value,max:sd.maxSupply&&sd.maxSupply.value};
   const extra=await fetchEthplorer();
   const text=buildTokenomicsText(desc,{...supply,...extra.supply},extra.meta);
   if(text) textEl.value=text; else alert('Token description not found');
  }catch(e){alert('Failed to search');}
};
 try{
  const data=await cacheFetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${addr}`);
  const desc=data.description&&data.description.en;
  const slug=data.id;
  const market=data.market_data||{};
  const supply={circulating:market.circulating_supply,total:market.total_supply,max:market.max_supply};
  const extra=await fetchEthplorer();
  const text=buildTokenomicsText(desc,{...supply,...extra.supply},extra.meta);
  if(text) textEl.value=text; else await tryCoinMarketCap(slug);
}catch(e){alert('Failed to search');}
spinner.hidden=true; searchBtn.disabled=false;
}

function render(res){
 const badge='badge-'+res.rating.toLowerCase();
 resultsEl.innerHTML=`<h3>Summary</h3><p>${res.summary}</p>
 <h3>Strengths</h3>${res.strengths.length?`<ul>${res.strengths.map(s=>`<li>${s}</li>`).join('')}</ul>`:'<p>None noted.</p>'}
 <h3>Concerns</h3>${res.concerns.length?`<ul>${res.concerns.map(c=>`<li>${c}</li>`).join('')}</ul>`:'<p>No major red flags.</p>'}
 <h3>Overall Rating <span class="${badge}">${res.rating}</span></h3>`;
}

async function run(){
 runBtn.disabled=true; spinner.hidden=false; resultsEl.innerHTML='';
 const text=textEl.value; const lower=text.toLowerCase();
 const concerns=patterns.filter(p=>p.test(lower)).map(p=>p.source);
 let holderFlag=false;
 const addr=(text.match(/0x[a-fA-F0-9]{40}/)||[])[0];
 if(addr){
  try{
   const data=await cacheFetch(`https://api.ethplorer.io/getTopTokenHolders/${addr}?apiKey=freekey&limit=10`);
   if(data.holdersCount && data.holdersCount<250) holderFlag=true;
   if(Array.isArray(data.holders)) holderFlag = holderFlag || data.holders.some(h=>h.share>15);
  }catch(e){}
 }
 const score=concerns.length*10+(holderFlag?20:0);
 const rating=score>=40?'Red':score>=20?'Yellow':'Green';
 const result={
  summary:`Found ${concerns.length} potential issues.`,
  strengths:[],
  concerns,
  rating
 };
 render(result);
 spinner.hidden=true; runBtn.disabled=false;
 location.hash=btoa(JSON.stringify({text, result}));
}

runBtn.addEventListener('click', run);
if(searchBtn) searchBtn.addEventListener('click', search);

window.addEventListener('load', ()=>{
 const hash=location.hash.slice(1);
 if(hash){
  try{
   const {text,result}=JSON.parse(atob(hash));
   textEl.value=text; render(result);
  }catch(e){}
 }
});
