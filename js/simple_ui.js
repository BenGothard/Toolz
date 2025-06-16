import { loadAgents } from './agent_loader.js';
import { runAgent } from './fallback_router.js';

const perfToggle = document.getElementById('performanceToggle');
const runButton = document.getElementById('runButton');
const inputArea = document.getElementById('inputText');
const outputArea = document.getElementById('outputArea');
const select = document.getElementById('agentSelect');
const instructionBox = document.getElementById("instructionBox");

const agentInstructions = {
  summarize_agent: "Enter text to summarize.",
  sentiment_agent: "Enter text to analyze sentiment.",
  embed_agent: "Enter text to embed into a vector."
};

function updateInstruction(name) {
  instructionBox.textContent = agentInstructions[name] || "";
}

(async () => {
  const agents = await loadAgents();
  agents.forEach(agent => {
    const option = document.createElement('option');
    option.value = agent.name;
    option.textContent = agent.name;
    select.appendChild(option);
  });
  updateInstruction(select.value);
  select.addEventListener("change", () => updateInstruction(select.value));

  runButton.addEventListener('click', async () => {
    const agentName = select.value;
    const agent = agents.find(a => a.name === agentName);
    if (!agent) {
      outputArea.textContent = 'Agent not found';
      return;
    }
    try {
      const result = await runAgent(agent, { text: inputArea.value }, perfToggle.checked);
      outputArea.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      outputArea.textContent = 'Error: ' + err.message;
    }
  });
})();
