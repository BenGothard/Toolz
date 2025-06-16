import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js';
import { registerAgent } from '../js/agent_loader.js';

let summarizer;
async function load() {
  if (!summarizer) {
    summarizer = await pipeline('summarization', 'Xenova/t5-small');
  }
  return summarizer;
}

registerAgent({
  name: 'summarize_agent',
  run: async ({ text }) => {
    const pipe = await load();
    const out = await pipe(text);
    return { summary: out[0].summary_text };
  }
});
