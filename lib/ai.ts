import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const GeminiService = {
    /**
     * Generates a concise summary of the provided text.
     */
    generateSummary: async (text: string): Promise<string> => {
        try {
            const prompt = `Summarize the following card description and context into a concise, actionable summary (max 3 sentences):\n\n${text}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Summary Error:", error);
            return "Failed to generate summary. Please try again.";
        }
    },

    /**
     * Converts natural language prompt into an automation rule structure.
     */
    generateAutomationRule: async (prompt: string): Promise<{ name: string; triggerType: string; actions: any[] } | null> => {
        try {
            const systemPrompt = `
            You are an automation expert for a Trello-like app.
            Convert the user's natural language request into a valid automation rule JSON.
            
            Supported Triggers: "card_moved", "card_created", "checklist_completed"
            Supported Actions: 
            - { "type": "add_comment", "data": { "text": "comment text" } }
            - { "type": "add_label", "data": {} }
            - { "type": "archive_card", "data": {} }

            Return ONLY raw JSON (no markdown formatting) with this structure:
            {
                "name": "Short descriptive name",
                "triggerType": "one of the supported triggers",
                "actions": [array of action objects]
            }

            User Request: "${prompt}"
            `;

            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini Automation Error:", error);
            return null;
        }
    }
};
