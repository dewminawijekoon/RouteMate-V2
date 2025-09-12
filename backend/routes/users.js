import express from 'express';
import multer from 'multer';
import { supabase } from '../utils/database.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get user by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
  
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('user_id,name,email,phone,profile_picture,gamification_points,created_at,updated_at')
        .eq('user_id', id)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(404).json({ ok: false, error: 'User not found' });
      }
      
      return res.json({ user: data });
    } else {
      console.warn('Database not configured');
      return res.status(500).json({ ok: false, error: 'Database not available' });
    }
  } catch (e) {
    console.error('user get error', e);
    return res.status(500).json({ ok: false });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
  
  const { name, phone, profile_picture, email } = req.body || {};
  const payload = {
    ...(name != null ? { name } : {}),
    ...(phone != null ? { phone } : {}),
    ...(email != null ? { email } : {}),
    ...(profile_picture != null ? { profile_picture } : {}),
    updated_at: new Date().toISOString(),
  };
  
  try {
    if (supabase) {
      // Ensure row exists with required fields if inserting
      const { data: existing, error: exErr } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', id)
        .maybeSingle();
      if (exErr) throw exErr;
      
      const base = { user_id: id, ...payload };
      if (!existing) {
        base.name = base.name ?? `User ${id}`;
        base.email = base.email ?? `user${id}@placeholder.local`;
        base.password = base.password ?? 'changeme';
      }
      
      const { data, error } = await supabase
        .from('users')
        .upsert(base, { onConflict: 'user_id' })
        .select('*')
        .single();
      if (error) throw error;
      return res.json({ ok: true, user: data });
    } else {
      console.warn('Database not configured');
      return res.status(500).json({ ok: false, error: 'Database not available' });
    }
  } catch (e) {
    console.error('user put error', e);
    return res.status(500).json({ ok: false });
  }
});

// Upload user avatar
router.post('/:id/avatar', upload.single('file'), async (req, res) => {
  try {
    if (!supabase) return res.status(501).json({ ok: false, error: 'Supabase not configured' });
    
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
    
    const file = req.file;
    if (!file) return res.status(400).json({ ok: false, error: 'file required' });

    // Ensure bucket exists
    try { 
      await supabase.storage.createBucket('avatars', { public: true }); 
    } catch {}

    const ext = (file.originalname?.split('.').pop() || 'jpg').toLowerCase();
    const path = `${id}/${Date.now()}.${ext}`;
    
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file.buffer, {
      contentType: file.mimetype || 'image/jpeg',
      upsert: true,
    });
    if (upErr) throw upErr;
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Update user profile picture
    const { error: updErr } = await supabase
      .from('users')
      .update({ profile_picture: publicUrl, updated_at: new Date().toISOString() })
      .eq('user_id', id);
    if (updErr) throw updErr;

    return res.json({ ok: true, url: publicUrl });
  } catch (e) {
    console.error('avatar upload error', e);
    return res.status(500).json({ ok: false, error: 'upload_failed' });
  }
});

export default router;