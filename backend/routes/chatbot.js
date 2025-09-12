import express from 'express';
import GeminiService from '../services/GeminiService.js';

const router = express.Router();

// General chatbot message with optional context
router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Message is required and must be a string' 
      });
    }

    let response;
    if (context) {
      response = await GeminiService.sendMessageWithContext(message, context);
    } else {
      response = await GeminiService.sendRouteMateMessage(message);
    }

    return res.json({ 
      ok: true, 
      response: response 
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to get response from AI assistant' 
    });
  }
});

// RouteMate-specific chatbot assistant
router.post('/routemate', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Message is required and must be a string' 
      });
    }

    const response = await GeminiService.sendRouteMateMessage(message);

    return res.json({ 
      ok: true, 
      response: response 
    });
  } catch (error) {
    console.error('RouteMate chatbot error:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to get response from AI assistant' 
    });
  }
});

export default router;