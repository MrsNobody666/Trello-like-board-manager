"use server";

import { GeminiService } from "@/lib/ai";

export async function generateRuleFromPrompt(prompt: string) {
    if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key not configured");
    return await GeminiService.generateAutomationRule(prompt);
}

export async function summarizeCardContent(text: string) {
    if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key not configured");
    return await GeminiService.generateSummary(text);
}
