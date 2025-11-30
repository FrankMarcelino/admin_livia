/**
 * Tenant Queries - Statistics & Relationships
 * Queries para estatísticas e dados relacionados de tenants
 */

import { supabase } from '@/lib/supabase'

/**
 * Busca estatísticas de um tenant (usuários, contatos, conversas, canais)
 * @param tenantId - ID do tenant
 * @returns Estatísticas do tenant
 */
export async function fetchTenantStats(tenantId: string) {
  const [users, contacts, conversations, channels] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    supabase.from('channels').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId)
  ])

  return {
    total_users: users.count || 0,
    total_contacts: contacts.count || 0,
    total_conversations: conversations.count || 0,
    total_channels: channels.count || 0
  }
}

/**
 * Busca canais configurados de um tenant
 * @param tenantId - ID do tenant
 * @returns Lista de canais
 */
export async function fetchTenantChannels(tenantId: string) {
  const { data, error } = await supabase
    .from('channels')
    .select('id, name, type, is_active')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching channels:', error)
    throw error
  }

  return data || []
}
