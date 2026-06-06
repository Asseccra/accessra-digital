import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side lazy initialization helper for Gemini AI Web SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not set up yet. Please supply one under Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper function to check if an error is a Gemini API quota/rate limit error
function isGeminiQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  return msg.includes('429') || 
         msg.includes('quota') || 
         msg.includes('rate limit') || 
         msg.includes('resource_exhausted') || 
         msg.includes('exhausted');
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// AI Support Chat Bot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();
    
    // Format message history safely for Gemini
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Inject system instructions as the personality
    const systemPrompt = `You are Accessra, the cybernetic AI Support Chatbot for Accessra Digital, a futuristic, premium marketplace for digital products in Indonesia.
Your personality is highly technical, digital, smart, polite, clean, and helpful. Speak with the attitude of an futuristic startup assistant.
Offer help with game vouchers, phone credits, streaming subscriptions, and delivery questions. 
Keep answers concise, modern, and in Indonesian by default, with English as an alternative.
Remind users that their digital products are processed automatically in milliseconds.`;

    let response;
    try {
      // Try the primary model
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
        history: formattedHistory
      });

      response = await chat.sendMessage({ message });
    } catch (chatErr: any) {
      // Check for quota/rate limit error, fall back to gemini-flash-latest
      if (isGeminiQuotaError(chatErr)) {
        console.warn('Primary chat model gemini-3.5-flash quota exceeded. Falling back to gemini-flash-latest...');
        const chatFallback = ai.chats.create({
          model: 'gemini-flash-latest',
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
          history: formattedHistory
        });
        response = await chatFallback.sendMessage({ message });
      } else {
        throw chatErr;
      }
    }

    res.json({ reply: response.text });
  } catch (err: any) {
    console.warn('Gemini Chat Service gentle fallback applied due to API rate limits or connectivity.');
    // Graceful fallback if API key is not configured or fails
    if (err.message && err.message.includes('GEMINI_API_KEY')) {
      res.json({ 
        reply: "Halo! Saya adalah Asisten AI Accessra Digital. Untuk mengaktifkan kecerdasan penuh saya, silahkan masukan kunci API Gemini di tab Settings > Secrets. Untuk saat ini, saya bekerja dengan sistem respons darurat: Kami menyediakan pengiriman instan untuk Voucher Game, Pulsa, dan langganan lainnya! Ada yang bisa saya bantu dengan akun atau pembelian Anda?"
      });
    } else {
      res.json({
        reply: "Saya mengalami sedikit gangguan siber di jaringan satelit kami. Namun jangan khawatir, seluruh pesanan dan transaksi Anda akan tetap diproses otomatis secara instan! Apakah ada hal lain yang bisa saya bantu secara manual?"
      });
    }
  }
});

// AI Personal Product Recommendation Engine
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { purchasedHistory, currentLevel, cashbackPoints } = req.body;

    const ai = getGeminiClient();

    const prompt = `Recommend additional digital products to an Accessra Digital customer with:
- Purchase history types / items: ${JSON.stringify(purchasedHistory || ['Telkomsel Pulsa', 'Mobile Legends Diamonds'])}
- User Tier level: ${currentLevel || 'Bronze'}
- Current Loyalty cashback points balance: Rp ${cashbackPoints || 0}

We have categories: 
1. Voucher Game (Diamonds, Crystals, Steam Wallet)
2. Pulsa / Paket Data (Telkomsel, Indosat)
3. E-Wallet Top Up (GoPay, DANA)
4. Streaming Accounts (Netflix, Spotify Premium)
5. Software Licenses (Windows 11 Pro, Canva Pro)
6. Gift Cards (Google Play USD)
7. Social Media Tools (Instagram Followers)

Your recommendation should be in a JSON structure containing:
1. "rationale" (A concise, smart, creative sentence in Indonesian explaining why these fit their tech level)
2. "recommendedIds" (An array containing 2 to 3 of these suggested product IDs: 'g1', 'g2', 'g3', 'p1', 'p2', 'd1', 'e1', 'e2', 's1', 's2', 'l1', 'l2', 'gc1', 'sm1')
3. "couponCode" (A special 15% discount code like 'CYBER15' or 'UPGRADEGOLD')

Return ONLY the clean JSON.`;

    let response;
    try {
      // Try the primary model
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
    } catch (recommendErr: any) {
      // Catch quota/rate limits and try gemini-flash-latest
      if (isGeminiQuotaError(recommendErr)) {
        console.warn('Primary recommendation model gemini-3.5-flash quota exceeded. Falling back to gemini-flash-latest...');
        response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
      } else {
        throw recommendErr;
      }
    }

    const textResult = (response.text || '').trim();
    let jsonStr = textResult;
    // Extract JSON if wrapped in markdown blocks
    if (jsonStr.startsWith('```')) {
      const match = jsonStr.match(/^(?:```json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonStr = match[1];
      }
    }
    res.json(JSON.parse(jsonStr.trim()));
  } catch (err: any) {
    console.warn('Gemini Recommendation Service gentle fallback applied due to API rate limits or connectivity.');
    // Simple fallback logic if Gemini is offline
    res.json({
      rationale: "Berdasarkan histori profil digital Anda, kami merekomendasikan penawaran flash sale eksklusif ini untuk mempercepat produktivitas siber Anda!",
      recommendedIds: ['g1', 's1', 'l1'],
      couponCode: "CYBER15"
    });
  }
});

// -------------------------------------------------------------
// VITE CLIENT INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Accessra Digital Full-Stack server running at http://localhost:${PORT}`);
  });
}

startServer();
