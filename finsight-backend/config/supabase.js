const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Backend uses the service_role key (not anon) because this is a trusted server
// environment. RLS is bypassed here - user data isolation is instead enforced
// in application code via .eq('user_id', userId) on every query.
// IMPORTANT: this key must NEVER be sent to the frontend or committed to git.
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;