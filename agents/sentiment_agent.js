import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js';
import { registerAgent } from '../js/agent_loader.js';

let classifier;
async function load() {
  if (!classifier) {
    classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  }
  return classifier;
}

registerAgent({
  name: 'sentiment_agent',
  run: async ({ text }) => {
    const pipe = await load();
    const out = await pipe(text);
    return out[0];
  }
});
