export function $(sel, root=document){return root.querySelector(sel);}
export async function cacheFetch(url, ttl=86400){
 const k='cf:'+url, now=Date.now()/1000;
 const item=JSON.parse(localStorage.getItem(k)||'{}');
 if(item.t && now-item.t<ttl) return item.d;
 const res=await fetch(url).then(r=>r.json());
 localStorage.setItem(k, JSON.stringify({t:now,d:res}));
 return res;
}
export function toggleTheme(){
 const h=document.documentElement;
 h.dataset.theme = h.dataset.theme==='dark'?'light':'dark';
}
