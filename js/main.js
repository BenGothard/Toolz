import { loadAgents } from './agent_loader.js';
import { runAgent } from './fallback_router.js';

const perfToggle = document.getElementById('performanceToggle');
const toolsContainer = document.getElementById('tools');

(async () => {
  const agents = await loadAgents();
  agents.forEach(agent => {
    const panel = document.createElement('div');
    panel.className = 'agent-panel';
    const title = document.createElement('h2');
    title.textContent = agent.name;
    const input = document.createElement('textarea');
    input.className = 'w-full border p-2';
    const button = document.createElement('button');
    button.textContent = 'Run';
    button.className = 'bg-blue-500 text-white px-2 py-1 mt-2';
    const output = document.createElement('pre');
    output.className = 'mt-2 bg-gray-100 p-2';
    button.addEventListener('click', async () => {
      const result = await runAgent(agent, { text: input.value }, perfToggle.checked);
      output.textContent = JSON.stringify(result, null, 2);
    });
    panel.appendChild(title);
    panel.appendChild(input);
    panel.appendChild(button);
    panel.appendChild(output);
    toolsContainer.appendChild(panel);
  });
})();
