import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/')) {
    return false;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return true;
  }

  // Route: /api/chat
  if (url === '/api/chat' && req.method === 'POST') {
    let userPrompt = '';
    let userLocation = { lat: 37.7749, lng: -122.4194 };

    try {
      const body = await parseBody(req);
      userPrompt = body.prompt || '';
      if (body.userLocation && typeof body.userLocation.lat === 'number') {
        userLocation = body.userLocation;
      }

      const ai = getAiClient();
      if (!ai) {
        sendJson(res, 200, {
          text: 'Google Gemini API key is not configured. Please set GEMINI_API_KEY in the Secrets panel to enable real-time Search Grounding.',
          groundingChunks: [],
          source: 'unconfigured_key',
        });
        return true;
      }

      const systemInstruction = `You are GeoPulse, an objective location and navigation assistant.
Provide factual, verified answers using Google Search.
If discussing places, routes, or local conditions, cite real sources.
Current user coordinates: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || 'No response returned from model.';
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingChunks = Array.isArray(rawChunks) ? rawChunks : [];

      sendJson(res, 200, {
        text: responseText,
        groundingChunks,
        source: 'gemini-3.8-flash-google-search',
      });
      return true;
    } catch (err: any) {
      console.warn('[API /api/chat error]:', err.message);

      // Factual error reporting without fabricating data
      sendJson(res, 200, {
        text: `Live search query could not be completed: ${err.message || 'Service temporarily unavailable'}. Please verify your API key or network connection.`,
        groundingChunks: [],
        error: true,
      });
      return true;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
  return true;
}
