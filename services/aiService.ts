
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CORE_SYSTEM_INSTRUCTION = `You are PERSEVAN-PRO, an omni-capable Technical Intelligence. 
Your primary directive is to provide objectively perfect, highly performant, and architecturally sound technical advice.

OPERATING MODES:
1. STUDY: Act as a world-class mentor. Simplify complexity without sacrificing technical depth. Use advanced analogies and explain the 'first principles' of any tech.
2. INTERVIEW: Act as a Staff Engineer from a top-tier tech company. Be critical, concise, and professional. Look for hidden signals: scalability, security, observability, and maintainability.

VISION PROTOCOL:
- When an image is provided (screenshot, diagram, error log), perform a pixel-perfect scan.
- Identify bugs, UI inconsistencies, or architectural patterns.
- Explicitly mention specific elements seen in the image.

REASONING:
- You have a massive thinking budget. Use it to simulate edge cases before responding.
- Your response must be the 'one true perfect answer' that a senior lead would approve.
- Always steer non-technical queries back to the tech stack.`;

export async function getPersevanResponse(
  prompt: string, 
  mode: 'study' | 'interview', 
  files: { name: string, content: string }[],
  images: { mimeType: string, data: string }[]
) {
  const model = 'gemini-3-pro-preview';
  
  const parts: any[] = [];
  
  // Attach Images for Multimodal Vision
  images.forEach(img => {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data
      }
    });
  });

  // Attach File Context
  let contextString = "";
  if (files.length > 0) {
    contextString += "SYSTEM CONTEXT - SOURCE FILES:\n" + 
      files.map(f => `FILE [${f.name}]:\n${f.content}`).join("\n\n") + "\n\n";
  }
  
  parts.push({ text: contextString + (prompt || "Provide a comprehensive technical analysis of the current context.") });

  const result = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction: mode === 'study' ? `${CORE_SYSTEM_INSTRUCTION}\nACTIVE MODE: STUDY` : `${CORE_SYSTEM_INSTRUCTION}\nACTIVE MODE: INTERVIEW`,
      temperature: 0.2, // Ultra-precision
      thinkingConfig: { thinkingBudget: 32768 } // Max reasoning
    },
  });

  return result.text || "Connection to Neural Core lost.";
}
