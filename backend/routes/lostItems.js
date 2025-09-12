import express from 'express';
import { Expo } from 'expo-server-sdk';
import { supabase } from '../utils/database.js';
import { distanceKm } from '../utils/helpers.js';

const router = express.Router();

// In-memory fallback
const mem = {
  lostItems: [],
  nextId: 1,
};

// Create lost item
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      trip_id,
      item_name,
      description,
      item_category,
      status,
      lost_date,
      contact_info,
      lost_location,
      // backward-compatible fields
      title,
      contact,
      bus_no,
      lat,
      lng,
    } = req.body || {};
    
    const name = item_name || title;
    if (!name) return res.status(400).json({ ok: false, error: 'item_name (title) required' });
    
    const loc = lost_location || 
      (lat != null && lng != null ? `${lat},${lng}` : undefined) || 
      (bus_no ? `bus:${bus_no}` : undefined) || 
      null;
    
    let item;
    let dbOk = false;
    
    if (supabase) {
      const insert = {
        user_id: user_id ?? null,
        trip_id: trip_id ?? null,
        item_name: name,
        description: description ?? null,
        item_category: item_category ?? null,
        status: status ?? 'lost',
        lost_date: lost_date ?? new Date().toISOString(),
        contact_info: contact_info ?? contact ?? null,
        lost_location: loc,
      };
      const { data, error } = await supabase.from('lost_items').insert(insert).select('*').single();
      if (error) throw error;
      item = data;
    } else {
      item = {
        lost_item_id: mem.nextId++,
        user_id: user_id ?? null,
        trip_id: trip_id ?? null,
        item_name: name,
        description: description ?? null,
        item_category: item_category ?? null,
        status: status ?? 'lost',
        lost_date: new Date().toISOString(),
        contact_info: contact_info ?? contact ?? null,
        lost_location: loc,
        created_at: new Date().toISOString(),
      };
      mem.lostItems.unshift(item);
    }

    // Emit real-time event (will be handled by main app)
    req.io?.emit('lost-item', item);

    return res.json({ ok: true, item });
  } catch (e) {
    console.error('lost-items create error', e);
    return res.status(500).json({ ok: false });
  }
});

// List latest lost items
router.get('/', async (_req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('lost_items').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return res.json({ items: data || [] });
    } else {
      return res.json({ items: mem.lostItems });
    }
  } catch (e) {
    console.error('lost-items list error', e);
    return res.json({ items: mem.lostItems });
  }
});

export default router;