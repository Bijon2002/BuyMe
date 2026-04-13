const axios = require('axios');
require('dotenv').config();

async function run() {
  try {
    const res = await axios.post(
      "https://router.huggingface.co/hf-inference/v1/chat/completions",
      {
        model: "HuggingFaceH4/zephyr-7b-beta",
        messages: [{ role: "user", content: "hello" }],
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('SUCCESS:', res.data);
  } catch(e) {
    console.error('ERROR DATA:', e.response ? e.response.data : e.message);
  }
}
run();
