import express from 'express';
import { supabase } from '../utils/database.js';

const router = express.Router();

// In-memory fallback
const mem = {
  tokens: new Map(), // token -> { user_id, platform, lat, lng }
};

// Register a device push token
router.post('/register', async (req, res) => {
  try {
    const { token, userId, platform, lat, lng } = req.body || {};
    
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({ ok: false, error: 'Invalid token' });
    }
    
    if (supabase) {
      const { error } = await supabase
        .from('push_tokens')
        .upsert({ 
          token, 
          user_id: userId ?? null, 
          platform: platform ?? null, 
          lat: lat ?? null, 
          lng: lng ?? null 
        }, { onConflict: 'token' });
      if (error) throw error;
    } else {
      mem.tokens.set(token, { 
        user_id: userId || null, 
        platform: platform || null, 
        lat: lat ?? null, 
        lng: lng ?? null 
      });
    }
    
    return res.json({ ok: true });
  } catch (e) {
    console.error('push/register error', e);
    return res.status(500).json({ ok: false });
  }
});

// Update location for a given token
router.post('/update-location', async (req, res) => {
  try {
    const { token, lat, lng } = req.body || {};
    
    if (!token) return res.status(400).json({ ok: false });
    
    if (supabase) {
      const { error } = await supabase
        .from('push_tokens')
        .update({ lat: lat ?? null, lng: lng ?? null })
        .eq('token', token);
      if (error) throw error;
    } else {
      const t = mem.tokens.get(token) || {};
      mem.tokens.set(token, { ...t, lat: lat ?? null, lng: lng ?? null });
    }
    
    return res.json({ ok: true });
  } catch (e) {
    console.error('push/update-location error', e);
    return res.status(500).json({ ok: false });
  }
});

export default router;