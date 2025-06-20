import { Request, Response } from 'express'
import { GoogleGenAI } from '@google/genai';
import { GOOGLE_GEN_AI_KEY } from '../config'

const ai = new GoogleGenAI({
    apiKey: GOOGLE_GEN_AI_KEY
});

export const postChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const { messages } = req.body; // historial de chat
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: 'Why is the sky blue?',
          });

      return res.json({ response: response.text });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
}

