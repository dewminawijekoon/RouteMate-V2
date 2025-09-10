import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Expo } from 'expo-server-sdk';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { pool, initTables } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Fallback in-memory stores if DB is unavailable
let dbOk = false;
const mem = {
  tokens: new Map(), // token -> { user_id, platform, lat, lng }
  lostItems: [], // { id, ... }
  nextId: 1,
};

// Supabase REST client (HTTPS 443) — avoids direct Postgres port issues
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supa = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Register a device push token (Supabase > DB > memory)
app.post('/push/register', async (req, res) => {
  try {
    const { token, userId, platform, lat, lng } = req.body || {};
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({ ok: false, error: 'Invalid token' });
    }
    if (supa) {
      const { error } = await supa
        .from('push_tokens')
        .upsert({ token, user_id: userId ?? null, platform: platform ?? null, lat: lat ?? null, lng: lng ?? null }, { onConflict: 'token' });
      if (error) throw error;
    } else if (dbOk) {
      await pool.query(
        `INSERT INTO push_tokens (token, user_id, platform, lat, lng)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (token)
         DO UPDATE SET user_id = EXCLUDED.user_id, platform = EXCLUDED.platform, lat = EXCLUDED.lat, lng = EXCLUDED.lng`,
        [token, userId || null, platform || null, lat ?? null, lng ?? null]
      );
    } else {
      mem.tokens.set(token, { user_id: userId || null, platform: platform || null, lat: lat ?? null, lng: lng ?? null });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error('push/register error', e);
    return res.status(500).json({ ok: false });
  }
});

// Update location for a given token
app.post('/push/update-location', async (req, res) => {
  try {
    const { token, lat, lng } = req.body || {};
    if (!token) return res.status(400).json({ ok: false });
    if (supa) {
      const { error } = await supa.from('push_tokens').update({ lat: lat ?? null, lng: lng ?? null }).eq('token', token);
      if (error) throw error;
    } else if (dbOk) {
      await pool.query(`UPDATE push_tokens SET lat=$2, lng=$3 WHERE token=$1`, [token, lat ?? null, lng ?? null]);
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

// Haversine distance in km
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Lost & Found: create (Supabase > DB > memory)
app.post('/lost-items', async (req, res) => {
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
    const loc = lost_location || (lat != null && lng != null ? `${lat},${lng}` : undefined) || (bus_no ? `bus:${bus_no}` : undefined) || null;
    let item;
    if (supa) {
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
      const { data, error } = await supa.from('lost_items').insert(insert).select('*').single();
      if (error) throw error;
      item = data;
    } else if (dbOk) {
      const result = await pool.query(
        `INSERT INTO lost_items (user_id, trip_id, item_name, description, item_category, status, lost_date, contact_info, lost_location)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [
          user_id ?? null,
          trip_id ?? null,
          name,
          description ?? null,
          item_category ?? null,
          status ?? 'lost',
          lost_date ?? new Date(),
          contact_info ?? contact ?? null,
          loc,
        ]
      );
      item = result.rows[0];
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

    // Realtime event for in-app updates
    io.emit('lost-item', item);

    // Push notifications to nearby users (fallback to all if no lat/lng)
    try {
      const expo = new Expo();
      const recipients = [];
      if (supa) {
        const { data, error } = await supa.from('push_tokens').select('token,user_id,lat,lng');
        if (error) throw error;
        recipients.push(...(data || []).map((r) => ({ token: r.token, user_id: r.user_id, lat: r.lat, lng: r.lng })));
      } else if (dbOk) {
        const tokens = await pool.query(`SELECT token, user_id, lat, lng FROM push_tokens`);
        recipients.push(...tokens.rows.map((r) => ({ token: r.token, user_id: r.user_id, lat: r.lat, lng: r.lng })));
      } else {
        for (const [tk, v] of mem.tokens.entries()) {
          recipients.push({ token: tk, user_id: v.user_id, lat: v.lat, lng: v.lng });
        }
      }
      const messages = [];
      // attempt to parse numeric lat,lng from lost_location like "6.93,79.85"
      let itemLat = undefined, itemLng = undefined;
      if (item?.lost_location && typeof item.lost_location === 'string') {
        const m = item.lost_location.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
        if (m) {
          itemLat = Number(m[1]);
          itemLng = Number(m[2]);
        }
      }
      for (const row of recipients) {
        if (!Expo.isExpoPushToken(row.token)) continue;
        if (row.user_id && item.user_id && row.user_id === item.user_id) continue; // skip poster
        if (itemLat != null && itemLng != null && row.lat != null && row.lng != null) {
          const d = distanceKm(itemLat, itemLng, row.lat, row.lng);
          if (d > 10) continue; // only nearby (<=10km)
        }
        messages.push({
          to: row.token,
          sound: 'default',
          title: 'Lost item reported',
          body: `${item.item_name}`,
          data: { type: 'lost-item', id: item.lost_item_id },
        });
      }
      const chunks = expo.chunkPushNotifications(messages);
      let success = 0;
      let failure = 0;
      for (const chunk of chunks) {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        for (const t of tickets) {
          if (t.status === 'ok') success += 1; else failure += 1;
        }
      }

      // Inform the posting client (if provided) about push results
      const socketId = req.header('x-socket-id') || req.header('X-Socket-Id');
      if (socketId) {
        io.to(socketId).emit('push-status', {
          type: 'lost-item',
          id: item.lost_item_id,
          success,
          failure,
        });
      }
    } catch (e) {
      console.error('Push send error', e?.message || e);
    }

    return res.json({ ok: true, item });
  } catch (e) {
    console.error('lost-items create error', e);
    return res.status(500).json({ ok: false });
  }
});

// Lost & Found: list latest (Supabase > DB > memory)
app.get('/lost-items', async (_req, res) => {
  try {
    if (supa) {
      const { data, error } = await supa.from('lost_items').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return res.json({ items: data || [] });
    } else if (dbOk) {
      const r = await pool.query(`SELECT * FROM lost_items ORDER BY created_at DESC LIMIT 100`);
      return res.json({ items: r.rows });
    }
    return res.json({ items: mem.lostItems });
  } catch (e) {
    console.error('lost-items list error', e);
    return res.json({ items: mem.lostItems });
  }
});

server.listen(PORT, async () => {
  try {
    await initTables();
    dbOk = true;
  } catch (e) {
    dbOk = false;
    console.warn('DB init failed (continuing):', e?.message || e);
  }
  console.log(`Server running on port ${PORT}`);
});
