import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmwvwfkjeadqekchivbd.supabase.co';
const supabaseAnonKey = 'sb_publishable_8xjf_s8HobaZ4ja8vQF_hg_gvPE5PD_';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
