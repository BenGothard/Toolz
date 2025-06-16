export async function runAgent(agent, input, performanceMode=false) {
  try {
    return await agent.run(input);
  } catch (err) {
    console.error('Agent error:', err);
    if (performanceMode && typeof agent.fallback === 'function') {
      return agent.fallback(input);
    }
    throw err;
  }
}
