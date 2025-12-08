/**
 * Channel Store - Gerenciamento de Canais
 * Store Zustand simplificado para canais (não requer paginação/filtros complexos)
 */

import { create } from 'zustand'
import { toast } from 'sonner'
import type { ChannelWithProvider } from '@/lib/queries/channel'
import type { ChannelCreateInput, ChannelUpdateInput } from '@/lib/validations/channelValidation'
import {
  fetchChannelsByTenant,
  fetchChannelById,
  fetchChannelProviders,
  createChannel as createChannelQuery,
  updateChannel as updateChannelQuery,
  deleteChannel as deleteChannelQuery
} from '@/lib/queries/channel'

/**
 * Interface do Channel Store
 */
export interface ChannelStore {
  // Estado
  channels: ChannelWithProvider[]
  selectedChannel: ChannelWithProvider | null
  providers: Array<{ id: string; name: string; channel_provider_identifier_code: string }>
  isLoading: boolean
  error: string | null

  // Ações - Fetch
  fetchChannelsByTenant: (tenantId: string) => Promise<void>
  fetchChannelById: (channelId: string) => Promise<void>
  fetchProviders: () => Promise<void>

  // Ações - CRUD
  createChannel: (channel: ChannelCreateInput) => Promise<ChannelWithProvider | null>
  updateChannel: (channelId: string, updates: ChannelUpdateInput) => Promise<ChannelWithProvider | null>
  deleteChannel: (channelId: string) => Promise<boolean>

  // Ações - Estado Local
  setSelectedChannel: (channel: ChannelWithProvider | null) => void
  clearError: () => void
}

/**
 * Channel Store Hook
 *
 * @example
 * ```tsx
 * function ChannelsList({ tenantId }: { tenantId: string }) {
 *   const { channels, fetchChannelsByTenant, isLoading } = useChannelStore()
 *
 *   useEffect(() => {
 *     fetchChannelsByTenant(tenantId)
 *   }, [tenantId])
 *
 *   return <div>...</div>
 * }
 * ```
 */
export const useChannelStore = create<ChannelStore>()((set) => ({
  // Estado inicial
  channels: [],
  selectedChannel: null,
  providers: [],
  isLoading: false,
  error: null,

  // ============================================================================
  // FETCH ACTIONS
  // ============================================================================

  /**
   * Busca todos os canais de um tenant
   */
  fetchChannelsByTenant: async (tenantId: string) => {
    set({ isLoading: true, error: null })

    try {
      const channels = await fetchChannelsByTenant(tenantId)
      set({ channels, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar canais'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
    }
  },

  /**
   * Busca um canal específico por ID
   */
  fetchChannelById: async (channelId: string) => {
    set({ isLoading: true, error: null })

    try {
      const channel = await fetchChannelById(channelId)
      set({ selectedChannel: channel, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar canal'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
    }
  },

  /**
   * Busca todos os provedores disponíveis
   */
  fetchProviders: async () => {
    set({ isLoading: true, error: null })

    try {
      const providers = await fetchChannelProviders()
      set({ providers, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar provedores'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
    }
  },

  // ============================================================================
  // CRUD ACTIONS
  // ============================================================================

  /**
   * Cria um novo canal
   */
  createChannel: async (channel: ChannelCreateInput) => {
    set({ isLoading: true, error: null })

    try {
      const newChannel = await createChannelQuery(channel)

      // Adiciona o novo canal à lista
      set((state) => ({
        channels: [newChannel, ...state.channels],
        isLoading: false
      }))

      toast.success('Canal criado com sucesso!')
      return newChannel
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar canal'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
      return null
    }
  },

  /**
   * Atualiza um canal existente
   */
  updateChannel: async (channelId: string, updates: ChannelUpdateInput) => {
    set({ isLoading: true, error: null })

    try {
      const updatedChannel = await updateChannelQuery(channelId, updates)

      // Atualiza o canal na lista
      set((state) => ({
        channels: state.channels.map((channel) =>
          channel.id === channelId ? updatedChannel : channel
        ),
        selectedChannel:
          state.selectedChannel?.id === channelId ? updatedChannel : state.selectedChannel,
        isLoading: false
      }))

      toast.success('Canal atualizado com sucesso!')
      return updatedChannel
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar canal'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
      return null
    }
  },

  /**
   * Deleta um canal
   */
  deleteChannel: async (channelId: string) => {
    set({ isLoading: true, error: null })

    try {
      await deleteChannelQuery(channelId)

      // Remove o canal da lista
      set((state) => ({
        channels: state.channels.filter((channel) => channel.id !== channelId),
        selectedChannel: state.selectedChannel?.id === channelId ? null : state.selectedChannel,
        isLoading: false
      }))

      toast.success('Canal removido com sucesso!')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover canal'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // ============================================================================
  // LOCAL STATE ACTIONS
  // ============================================================================

  /**
   * Define o canal selecionado
   */
  setSelectedChannel: (channel: ChannelWithProvider | null) => {
    set({ selectedChannel: channel })
  },

  /**
   * Limpa o erro
   */
  clearError: () => {
    set({ error: null })
  }
}))
