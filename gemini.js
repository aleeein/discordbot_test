const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.API_KEY;
const MODEL = "gemini-pro"; // Replace with your actual model name

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    throw new Error("Failed to generate response");
  }
}

module.exports = { generateResponse };