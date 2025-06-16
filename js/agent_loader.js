export const agents = [];
export function registerAgent(agent) {
  agents.push(agent);
}

export async function loadAgents() {
  const modules = [
    './agents/summarize_agent.js',
    './agents/sentiment_agent.js',
    './agents/speech_agent.js',
    './agents/embed_agent.js'
  ];
  await Promise.all(modules.map((m) => import(m)));
  return agents;
}
