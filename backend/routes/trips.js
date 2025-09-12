import express from 'express';
import { supabase } from '../utils/database.js';

const router = express.Router();

// Update trip location
router.post('/:id/location', async (req, res) => {
  const tripId = Number(req.params.id);
  const { route_id, bus_id, current_lat, current_lng, crowd_level } = req.body || {};
  
  if (!tripId || !bus_id || !route_id) {
    return res.status(400).json({ 
      ok: false, 
      error: 'trip_id, route_id, bus_id required' 
    });
  }
  
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('trips')
        .upsert({
          trip_id: tripId,
          route_id,
          bus_id,
          current_lat,
          current_lng,
          crowd_level: crowd_level ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'trip_id' })
        .select('*')
        .single();
      if (error) throw error;
      
      // Emit real-time update (will be handled by main app)
      req.io?.emit('bus-location', { route_id, trip: data });
      
      return res.json({ ok: true, trip: data });
    } else {
      console.warn('Database not configured');
      return res.status(500).json({ ok: false, error: 'Database not available' });
    }
  } catch (e) {
    console.error('trip location error', e);
    return res.status(500).json({ ok: false });
  }
});

export default router;