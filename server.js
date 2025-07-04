require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/speak', async (req, res) => {
  const text = req.body.text;

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
      console.error("TTS failed:", errText);
      return res.status(500).send("Voice generation failed: " + errText);
    }

    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'audio/mpeg' });
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Voice error:', err);
    res.status(500).send('Voice generation failed');
  }
});

app.listen(port, () => {
  console.log(`🧞 Genie is live at http://localhost:${port}`);
});
