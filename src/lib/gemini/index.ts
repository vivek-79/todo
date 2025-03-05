

import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(key || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const todoPrompt = ({ topic }: { topic: string }) => (`
    Create a array of tasks inorder to ${topic} and provide in ONLY a array containing tasks without any additional notes or explanations:


          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Return task name instead of string,
          Include Only 5-7 Tasks
`)

export const getAiTodos = async ({ prompt }: { prompt: string }) => {

    try {
        const result = await model.generateContent(prompt);
        if (!result.response || !result.response.text) {
            throw new Error("Invalid AI response format");
        }
        return result.response.text();
    } catch (error) {
        console.error("Error generating AI insight:", error);
        return ""; // Return empty string to prevent crashes
    }
}