/**
 * Channel Queries - Fetch Operations
 * Queries de leitura/busca de canais
 */

import { supabase } from '@/lib/supabase'
import type { Channel } from '@/types/database.types'

/**
 * Interface para canal com relacionamento de provider
 */
export interface ChannelWithProvider extends Channel {
  channel_provider: {
    id: string
    name: string
    channel_provider_identifier_code: string
  } | null
}

/**
 * Busca todos os canais de um tenant específico
 * @param tenantId - ID do tenant
 * @returns Lista de canais com provider
 */
export async function fetchChannelsByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_provider:channel_providers!channel_provider_id(
        id,
        name,
        channel_provider_identifier_code
      )
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching channels:', error)
    throw error
  }

  return (data || []) as ChannelWithProvider[]
}

/**
 * Busca um canal específico por ID
 * @param channelId - ID do canal
 * @returns Canal com provider ou null
 */
export async function fetchChannelById(channelId: string) {
  const { data, error } = await supabase
    .from('channels')
    .select(`
      *,
      channel_provider:channel_providers!channel_provider_id(
        id,
        name,
        channel_provider_identifier_code
      )
    `)
    .eq('id', channelId)
    .single()

  if (error) {
    console.error('Error fetching channel:', error)
    throw error
  }

  return data as ChannelWithProvider | null
}

/**
 * Busca todos os provedores de canal disponíveis
 * @returns Lista de provedores
 */
export async function fetchChannelProviders() {
  const { data, error } = await supabase
    .from('channel_providers')
    .select('id, name, channel_provider_identifier_code')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching channel providers:', error)
    throw error
  }

  return data || []
}

/**
 * Verifica se um número de identificação já existe para o tenant
 * @param identificationNumber - Número a verificar
 * @param tenantId - ID do tenant
 * @param excludeId - ID do canal a excluir da busca (para edição)
 * @returns true se número já existe
 */
export async function checkIdentificationNumberExists(
  identificationNumber: string,
  tenantId: string,
  excludeId?: string
) {
  let query = supabase
    .from('channels')
    .select('id')
    .eq('identification_number', identificationNumber)
    .eq('tenant_id', tenantId)
    .limit(1)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking identification number:', error)
    throw error
  }

  return (data?.length || 0) > 0
}
