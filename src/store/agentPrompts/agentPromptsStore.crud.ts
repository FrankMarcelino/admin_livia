import { StateCreator } from 'zustand'
import { toast } from 'sonner'
import { AgentPromptsStore } from './agentPromptsStore.types'
import * as queries from '@/lib/queries/agentPrompts'

export const createAgentPromptsCrudSlice: StateCreator<
  AgentPromptsStore,
  [],
  [],
  AgentPromptsStore
> = (set) => ({
  // Estado inicial
  guardRails: null,
  observer: null,
  intention: null,
  system: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  currentTenantId: null,

  // Ações
  fetchPromptByType: async (type, tenantId) => {
    set({ isLoading: true, error: null })
    try {
      const data = await queries.fetchPromptByType(type, tenantId)

      // Converter tipo para camelCase para corresponder às propriedades do estado
      const stateKey = type === 'guard_rails' ? 'guardRails' : type

      set({ [stateKey]: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching prompt:', error)
      const errorMessage = `Erro ao carregar prompt ${type}`
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
    }
  },

  upsertPrompt: async (type, tenantId, data) => {
    set({ isSubmitting: true, error: null })
    try {
      const updated = await queries.upsertPrompt(type, tenantId, data)

      // Converter tipo para camelCase para corresponder às propriedades do estado
      const stateKey = type === 'guard_rails' ? 'guardRails' : type

      set({ [stateKey]: updated, isSubmitting: false })
      toast.success('Prompt salvo com sucesso!')
    } catch (error) {
      const errorMessage = 'Erro ao salvar prompt'
      set({ error: errorMessage, isSubmitting: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setCurrentTenantId: (tenantId) => set({ currentTenantId: tenantId }),

  reset: () => set({
    guardRails: null,
    observer: null,
    intention: null,
    system: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    currentTenantId: null
  })
})
