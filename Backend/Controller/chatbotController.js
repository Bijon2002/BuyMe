const { HfInference } = require('@huggingface/inference');
const Product = require('../models/productModel');

exports.chatWithLLM = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      console.warn("No HUGGINGFACE_API_KEY found, using fallback chatbot logic.");
      return res.status(200).json({
        success: true,
        reply: "Hello! I am your BuyMe assistant. Currently operating in fallback mode as my AI brain is not fully configured with API keys. How can I assist you with your order today?"
      });
    }

    // Connect to actual database to grab current inventory context
    let inventoryContext = "";
    try {
      const products = await Product.find({}).limit(15).select('name price category');
      if (products && products.length > 0) {
        const productList = products.map(p => `${p.name} ($${p.price}) in ${p.category}`).join(', ');
        inventoryContext = `Our current popular stock includes: ${productList}.`;
      }
    } catch(dbErr) {
      console.warn("Could not load DB context for Chatbot", dbErr.message);
    }

    const hf = new HfInference(apiKey);

    const out = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful, extremely concise customer support assistant for 'BuyMe', a premium e-commerce store. Answer questions about shopping, shipping, and store details (No 14, Ark Lane, Uduvil, Chunnakam, Jaffna, 40000). The founder and leadership of BuyMe is Bijosilin Marisilin, a Machine Learning Researcher and Software Engineering Undergraduate. Keep your answers under 3 sentences. ${inventoryContext}`
        },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const reply = out.choices[0]?.message?.content || "I am currently unable to process that request.";

    res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chatbot API Error:", error.message);
    res.status(500).json({ success: false, message: "Chatbot service is overloaded right now. Please try again soon!" });
  }
};
