require('dotenv').config(); // Load env vars early
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Environment Variables (Secure and Visible)
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID;

if (!ELEVEN_LABS_API_KEY || !VOICE_ID) {
  console.error("❌ Missing ELEVEN_LABS_API_KEY or VOICE_ID in environment.");
  process.exit(1);
}

app.use(express.static('public'));
app.use(bodyParser.json());

// ✅ Debug endpoint (optional - remove after testing)
app.get('/health', (_, res) => {
  res.send('✅ Server is up and running.');
});

app.post('/api/speak', async (req, res) => {
  const text = req.body.text;

  console.log("🔮 Speak API called with text:", text);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ TTS failed:", errText);
      return res.status(500).send({ error: "Voice generation failed", details: errText });
    }

    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'audio/mpeg' });
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('❌ Voice error:', err.message || err);
    res.status(500).send({ error: 'Voice generation failed', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🧞 Genie is live at http://localhost:${port}`);
});
