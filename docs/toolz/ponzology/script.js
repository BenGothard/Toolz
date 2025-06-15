import { $, cacheFetch, toggleTheme } from '../../util.js';

const textEl = $('#text');
const runBtn = $('#run');
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

window.addEventListener('load', ()=>{
 const hash=location.hash.slice(1);
 if(hash){
  try{
   const {text,result}=JSON.parse(atob(hash));
   textEl.value=text; render(result);
  }catch(e){}
 }
});
