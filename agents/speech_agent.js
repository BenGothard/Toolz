import { registerAgent } from '../js/agent_loader.js';

registerAgent({
  name: 'speech_agent',
  run: async () => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        reject(new Error('SpeechRecognition not supported'));
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        resolve({ text });
      };
      recognition.onerror = (e) => reject(e);
      recognition.start();
    });
  }
});
