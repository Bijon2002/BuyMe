const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/chatbot', { message: 'hello' });
    console.log("SUCCESS:", res.data);
  } catch(e) {
    console.log("ERROR STATUS:", e.response ? e.response.status : e.message);
    console.log("ERROR DATA:", e.response ? e.response.data : '');
  }
}
run();
