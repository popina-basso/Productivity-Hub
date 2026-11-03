import { createClient } from '@supabase/supabase-js';

// Remplace ces deux chaînes par tes propres identifiants Supabase
const supabaseUrl = 'https://cttgsolriaweyzlbyrfb.supabase.co';
const supabaseAnonKey = 'sb_publishable_7lodsikocnPMs_fAIvVt8g_F8PEm5f0';

// Création du canal de communication direct et sécurisé
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
