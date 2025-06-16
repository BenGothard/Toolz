import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js';
import { registerAgent } from '../js/agent_loader.js';

let embedder;
async function load() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function saveEmbedding(text, vector) {
  const db = await openDB();
  const tx = db.transaction('embeds', 'readwrite');
  tx.objectStore('embeds').add({ text, vector });
  await tx.complete;
}

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('embeddings', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('embeds', { autoIncrement: true });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

registerAgent({
  name: 'embed_agent',
  run: async ({ text }) => {
    const pipe = await load();
    const out = await pipe(text, { pooling: 'mean' });
    const vector = Array.from(out.data);
    await saveEmbedding(text, vector);
    return { vector };
  }
});
