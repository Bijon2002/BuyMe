const express = require('express');
const router = express.Router();
const { chatWithLLM } = require('../Controller/chatbotController');

// Define route
router.post('/', chatWithLLM);

module.exports = router;
