require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/prompt', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).send({ error: "Please provide a prompt." });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send({ error: "Failed to generate content." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});