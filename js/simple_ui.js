import { loadAgents } from './agent_loader.js';
import { runAgent } from './fallback_router.js';

const perfToggle = document.getElementById('performanceToggle');
const runButton = document.getElementById('runButton');
const inputArea = document.getElementById('inputText');
const outputArea = document.getElementById('outputArea');
const select = document.getElementById('agentSelect');

(async () => {
  const agents = await loadAgents();
  agents.forEach(agent => {
    const option = document.createElement('option');
    option.value = agent.name;
    option.textContent = agent.name;
    select.appendChild(option);
  });

  runButton.addEventListener('click', async () => {
    const agentName = select.value;
    const agent = agents.find(a => a.name === agentName);
    if (!agent) {
      outputArea.textContent = 'Agent not found';
      return;
    }
    const result = await runAgent(agent, { text: inputArea.value }, perfToggle.checked);
    outputArea.textContent = JSON.stringify(result, null, 2);
  });
})();
