/**
 * Channel Queries - CRUD Operations
 * Queries de criação, atualização e exclusão de canais
 */

import { supabase } from '@/lib/supabase'
import type { ChannelCreateInput, ChannelUpdateInput } from '@/lib/validations/channelValidation'
import type { ChannelInsert, ChannelUpdate } from '@/types/database.types'
import type { ChannelWithProvider } from './channel-fetch.queries'

/**
 * Cria um novo canal
 * @param channel - Dados do canal a criar
 * @returns Canal criado com provider
 */
export async function createChannel(channel: ChannelCreateInput) {
  const channelData: ChannelInsert = {
    ...channel,
    observations: channel.observations || null,
    identification_channel_client_descriptions: channel.identification_channel_client_descriptions || null,
    message_wait_time_fragments: channel.message_wait_time_fragments ?? 8,
    config_json: null
  }

  const { data, error } = await (supabase as any)
    .from('channels')
    .insert(channelData)
    .select(`
      *,
      channel_provider:channel_providers!channel_provider_id(
        id,
        name,
        channel_provider_identifier_code
      )
    `)
    .single()

  if (error) {
    console.error('Error creating channel:', error)
    throw error
  }

  return data as ChannelWithProvider
}

/**
 * Atualiza um canal existente
 * @param channelId - ID do canal
 * @param updates - Dados a atualizar
 * @returns Canal atualizado com provider
 */
export async function updateChannel(channelId: string, updates: ChannelUpdateInput) {
  const updateData: ChannelUpdate = {
    ...updates,
    observations: updates.observations || null,
    identification_channel_client_descriptions: updates.identification_channel_client_descriptions || null,
    message_wait_time_fragments: updates.message_wait_time_fragments ?? 8
  }

  const { data, error } = await (supabase as any)
    .from('channels')
    .update(updateData)
    .eq('id', channelId)
    .select(`
      *,
      channel_provider:channel_providers!channel_provider_id(
        id,
        name,
        channel_provider_identifier_code
      )
    `)
    .single()

  if (error) {
    console.error('Error updating channel:', error)
    throw error
  }

  return data as ChannelWithProvider
}

/**
 * Deleta um canal
 * @param channelId - ID do canal
 * @returns void
 */
export async function deleteChannel(channelId: string) {
  const { error } = await supabase
    .from('channels')
    .delete()
    .eq('id', channelId)

  if (error) {
    console.error('Error deleting channel:', error)
    throw error
  }
}

/**
 * Alterna o status ativo de um canal
 * @param channelId - ID do canal
 * @param isActive - Novo status
 * @returns Canal atualizado
 */
export async function toggleChannelActiveStatus(channelId: string, isActive: boolean) {
  return updateChannel(channelId, { is_active: isActive } as ChannelUpdateInput)
}

/**
 * Alterna o status de recebimento de mensagens
 * @param channelId - ID do canal
 * @param isReceiving - Novo status
 * @returns Canal atualizado
 */
export async function toggleChannelReceivingMessages(channelId: string, isReceiving: boolean) {
  return updateChannel(channelId, { is_receiving_messages: isReceiving } as ChannelUpdateInput)
}

/**
 * Alterna o status de envio de mensagens
 * @param channelId - ID do canal
 * @param isSending - Novo status
 * @returns Canal atualizado
 */
export async function toggleChannelSendingMessages(channelId: string, isSending: boolean) {
  return updateChannel(channelId, { is_sending_messages: isSending } as ChannelUpdateInput)
}
