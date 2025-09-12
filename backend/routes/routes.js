import express from 'express';
import { supabase } from '../utils/database.js';

const router = express.Router();

// List all routes
router.get('/', async (_req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('routes')
        .select('route_id,route_name,start_location,end_location,estimated_duration,updated_at')
        .order('route_id');
      if (error) throw error;
      return res.json({ routes: data || [] });
    } else {
      console.warn('Database not configured');
      return res.json({ routes: [] });
    }
  } catch (e) {
    console.error('routes list error', e);
    return res.json({ routes: [] });
  }
});

// Get route details
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
  
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('route_id', id)
        .single();
      if (error) throw error;
      return res.json({ route: data });
    } else {
      console.warn('Database not configured');
      return res.json({ route: null });
    }
  } catch (e) {
    console.error('route get error', e);
    return res.status(500).json({ ok: false });
  }
});

// Get buses on a route with latest trip locations
router.get('/:id/buses', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
  
  try {
    if (supabase) {
      const { data: buses, error: e1 } = await supabase
        .from('buses')
        .select('bus_id,bus_owner,contact_number,capacity,bus_type')
        .eq('route_id', id);
      if (e1) throw e1;
      
      const { data: trips, error: e2 } = await supabase
        .from('trips')
        .select('trip_id,bus_id,current_lat,current_lng,crowd_level,updated_at')
        .eq('route_id', id);
      if (e2) throw e2;
      
      const latest = new Map();
      (trips || []).forEach((t) => {
        const prev = latest.get(t.bus_id);
        if (!prev || new Date(t.updated_at) > new Date(prev.updated_at)) {
          latest.set(t.bus_id, t);
        }
      });
      
      const result = (buses || []).map((b) => ({
        ...b,
        trip: latest.get(b.bus_id) || null,
      }));
      
      return res.json({ buses: result });
    } else {
      console.warn('Database not configured');
      return res.json({ buses: [] });
    }
  } catch (e) {
    console.error('route buses error', e);
    return res.json({ buses: [] });
  }
});

export default router;