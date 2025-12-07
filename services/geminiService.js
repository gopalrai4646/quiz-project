import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MAX_RETRIES = 2;

/**
 * Generates quiz questions based on the topic.
 */
export const generateQuizQuestions = async (topic) => {
  const modelId = "gemini-2.5-flash";
  
  // Define Schema using the SDK's Type enum
  const schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    },
    required: ["questions"]
  };

  const prompt = `Generate a quiz with exactly 5 multiple-choice questions about "${topic}".
Each question must be uniquely created and must not repeat wording or structure from common or previously generated questions.
Ensure the questions cover different aspects or angles of the topic.
Each question must have exactly 4 answer options labeled A, B, C, and D, and the correctIndex must be an integer between 0 and 3 corresponding to the correct option.
Make the tone engaging and educational, and avoid generic or repetitive phrasing.
Provide only valid, factually accurate content.`;


  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    try {
      const result = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("Empty response from AI");

      const parsedData = JSON.parse(responseText);
      
      // Basic validation
      if (!parsedData.questions || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
        throw new Error("Invalid format: questions array missing or empty");
      }

      // Validate constraints
      const validQuestions = parsedData.questions.every((q) => 
        q.options && 
        q.options.length === 4 && 
        typeof q.correctIndex === 'number' && 
        q.correctIndex >= 0 && 
        q.correctIndex <= 3
      );

      if (!validQuestions) {
        throw new Error("Invalid format: Questions do not meet structure requirements");
      }

      return parsedData.questions;

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt > MAX_RETRIES) {
        throw new Error("Failed to generate quiz after multiple attempts. Please try again.");
      }
    }
  }
  return [];
};

/**
 * Generates feedback based on the score.
 */
export const generateFeedback = async (topic, score, total) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short, friendly feedback message for a user who took a quiz on "${topic}".
      They scored ${score} out of ${total}.
      If the score is high, be congratulatory.
      If the score is low, be encouraging and suggest one specific tip to learn more about ${topic}.
      Keep it under 50 words. Plain text only.`,
    });

    return result.text || "Great job taking the quiz!";
  } catch (error) {
    console.error("Feedback generation error:", error);
    return `You scored ${score} out of ${total}. Good effort!`;
  }
};


