
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, ReportType, AnalysisResult } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatLogsForPrompt = (logs: LogEntry[]): string => {
  if (logs.length === 0) return "No activities logged for this period.";

  return logs.map(log => {
    const date = new Date(log.timestamp);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString();
    return `[${log.id}] [${dateStr} ${time}] ${log.content}`;
  }).join('\n');
};

export const generateSummary = async (logs: LogEntry[], type: ReportType): Promise<string> => {
  try {
    const formattedLogs = formatLogsForPrompt(logs);
    
    let prompt = "";
    if (type === ReportType.DAILY_REFLECTION) {
      prompt = `Here are my logs for today. Please help me reflect on my day.
      
      Goal: Create a narrative summary of my day.
      - Highlight 2-3 key accomplishments.
      - Identify any time gaps or distractions if apparent, but be gentle.
      - End with a motivating thought for tomorrow.
      
      Logs:
      ${formattedLogs}`;
    } else {
      prompt = `Here are my logs. Please generate a professional status report.
      
      Format:
      ## Executive Summary
      (2-3 sentences)
      
      ## Key Deliverables
      - (Bullet points of completed work)
      
      ## Timeline / Activities
      - (Grouped by category like "Meetings", "Deep Work", "Admin")
      
      ## Next Steps / Blockers
      (Inferred from context or state "None" if unclear)
      
      Logs:
      ${formattedLogs}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      }
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "An error occurred while communicating with the AI. Please check your network connection.";
  }
};

export const analyzeDay = async (logs: LogEntry[]): Promise<AnalysisResult> => {
  try {
    const formattedLogs = formatLogsForPrompt(logs);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following daily logs. 
      1. Create a very brief, punchy 1-sentence summary of the main focus of the day (e.g. "Heavy focus on frontend debugging with some afternoon meetings").
      2. Identify the IDs of the logs that represent key achievements, important decisions, or completed tasks (the "highlights").
      
      Logs:
      ${formattedLogs}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            importantLogIds: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'importantLogIds']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing day:", error);
    return { summary: "Could not analyze logs.", importantLogIds: [] };
  }
};
