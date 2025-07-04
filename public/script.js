const questions = [
    "Think your AGE.",
    "Add your AGE digits. (Example: 1 + 8 = 9)",
    "Now your AGE has become a single digit.",
    "Multiply that with NINE.",
    "Now you have a TWO digit number. Add both digits.",
    "Now you have a SINGLE digit number.",
    "Spell that number in your mind again and again.",
    "And the number you are spelling is... counting 3... 2... 1...",
    "It's NINE!"
  ];
  
  async function playWithElevenLabs(text) {
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
  
      if (!response.ok) throw new Error('Voice API Error');
  
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      await new Promise(resolve => audio.onended = resolve);
    } catch (err) {
      console.warn("Using fallback:", err);
      fallbackSpeak(text);
    }
  }
  
  function fallbackSpeak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }
  
  async function startMagic() {
    for (let i = 0; i < questions.length; i++) {
      document.getElementById("statusText").innerText = questions[i];
      await playWithElevenLabs(questions[i]);
  
      // Wait for user to say 'OK' or 'Done' (simulated by delay)
      await waitForUserResponse(); 
    }
  }
  
  async function waitForUserResponse() {
    return new Promise(resolve => {
      const listener = () => {
        window.removeEventListener('click', listener);
        resolve();
      };
      window.addEventListener('click', listener);
    });
  }
  
  document.getElementById("startBtn").addEventListener("click", startMagic);
  