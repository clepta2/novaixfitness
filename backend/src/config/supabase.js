// src/config/supabase.js
// Cliente Supabase para Backend

const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useServiceKey = serviceKey && !serviceKey.includes('sua_') && serviceKey !== '';

const supabase = createClient(
  process.env.SUPABASE_URL,
  useServiceKey ? serviceKey : process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
