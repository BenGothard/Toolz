import { loadAgents } from './agent_loader.js';
import { runAgent } from './fallback_router.js';

const perfToggle = document.getElementById('performanceToggle');
const runButton = document.getElementById('runButton');
const inputArea = document.getElementById('inputText');
const outputArea = document.getElementById('outputArea');
const select = document.getElementById('agentSelect');
const statusTerminal = document.getElementById('statusTerminal');

function logStatus(message) {
  const lines = statusTerminal.textContent.split('\n').filter(Boolean);
  lines.push(message);
  while (lines.length > 3) lines.shift();
  statusTerminal.textContent = lines.join('\n');
}

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
      logStatus('Agent not found');
      return;
    }
    logStatus(`Running ${agentName}...`);
    try {
      const result = await runAgent(agent, { text: inputArea.value }, perfToggle.checked);
      outputArea.textContent = JSON.stringify(result, null, 2);
      logStatus('Done');
    } catch (err) {
      outputArea.textContent = 'Error: ' + err.message;
      logStatus('Error: ' + err.message);
    }
  });
})();
