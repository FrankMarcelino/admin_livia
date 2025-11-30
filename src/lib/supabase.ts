import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL. Please check your .env file.')
}

/**
 * Cliente Supabase para plataforma ADMIN
 *
 * IMPORTANTE: Esta plataforma é de uso INTERNO e usa a Service Role Key
 * que bypassa todas as políticas RLS (Row Level Security).
 *
 * Isso é seguro porque:
 * 1. Esta aplicação é apenas para administradores
 * 2. Não é exposta publicamente
 * 3. A plataforma de usuário usa o Anon Key com RLS ativo
 *
 * Se você preferir usar RLS mesmo na plataforma admin, substitua
 * supabaseServiceRoleKey por supabaseAnonKey abaixo.
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Admin não precisa persistir sessão
      autoRefreshToken: false
    }
  }
)
