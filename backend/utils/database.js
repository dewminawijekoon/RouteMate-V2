import { createClient } from '@supabase/supabase-js';

// Supabase client - single source of truth for database access
let supabase = null;

// Initialize Supabase if credentials are available
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  Supabase credentials not configured. Using fallback storage.');
}

// Export supabase client for direct use in routes
export { supabase };

// Database health check
export async function checkDatabaseHealth() {
  if (!supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    return { connected: true, service: 'Supabase' };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// Backward compatibility exports (for gradual migration)
export const pool = null; // This will cause errors if used, forcing migration to Supabase
export async function initTables() {
  console.log('✅ Using Supabase - no table initialization needed');
  return;
}

// In-memory stores as fallbacks
export const memoryStore = {
  lostItems: [],
  users: [],
  routes: [],
  trips: [],
  pushTokens: []
};

// Database operations with fallbacks
export class Database {
  // Lost Items operations
  static async getLostItems() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.warn('Supabase getLostItems failed, using memory store:', error.message);
    }
    return memoryStore.lostItems;
  }

  static async createLostItem(item) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('lost_items')
          .insert([item])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.warn('Supabase createLostItem failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const newItem = { 
      id: Date.now().toString(), 
      ...item, 
      created_at: new Date().toISOString() 
    };
    memoryStore.lostItems.unshift(newItem);
    return newItem;
  }

  static async updateLostItem(id, updates) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('lost_items')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.warn('Supabase updateLostItem failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const index = memoryStore.lostItems.findIndex(item => item.id === id);
    if (index !== -1) {
      memoryStore.lostItems[index] = { ...memoryStore.lostItems[index], ...updates };
      return memoryStore.lostItems[index];
    }
    return null;
  }

  static async deleteLostItem(id) {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('lost_items')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      }
    } catch (error) {
      console.warn('Supabase deleteLostItem failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const index = memoryStore.lostItems.findIndex(item => item.id === id);
    if (index !== -1) {
      memoryStore.lostItems.splice(index, 1);
      return true;
    }
    return false;
  }

  // User operations
  static async getUsers() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.warn('Supabase getUsers failed, using memory store:', error.message);
    }
    return memoryStore.users;
  }

  static async createUser(user) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .insert([user])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.warn('Supabase createUser failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const newUser = { 
      id: Date.now().toString(), 
      ...user, 
      created_at: new Date().toISOString() 
    };
    memoryStore.users.push(newUser);
    return newUser;
  }

  static async updateUser(id, updates) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.warn('Supabase updateUser failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const index = memoryStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      memoryStore.users[index] = { ...memoryStore.users[index], ...updates };
      return memoryStore.users[index];
    }
    return null;
  }

  // Route operations
  static async getRoutes() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('routes')
          .select('*');
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.warn('Supabase getRoutes failed, using memory store:', error.message);
    }
    return memoryStore.routes;
  }

  // Push token operations
  static async savePushToken(token, userId) {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('push_tokens')
          .upsert([{ token, user_id: userId }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.warn('Supabase savePushToken failed, using memory store:', error.message);
    }
    
    // Fallback to memory store
    const existingIndex = memoryStore.pushTokens.findIndex(t => t.user_id === userId);
    const tokenData = { token, user_id: userId, created_at: new Date().toISOString() };
    
    if (existingIndex !== -1) {
      memoryStore.pushTokens[existingIndex] = tokenData;
    } else {
      memoryStore.pushTokens.push(tokenData);
    }
    
    return tokenData;
  }

  static async getPushTokens() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('push_tokens')
          .select('*');
        
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.warn('Supabase getPushTokens failed, using memory store:', error.message);
    }
    return memoryStore.pushTokens;
  }
}