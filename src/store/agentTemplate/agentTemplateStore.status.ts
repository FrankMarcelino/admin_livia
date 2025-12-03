import { StateCreator } from 'zustand'
import { AgentTemplateStore } from './agentTemplateStore.types'
import { toggleAgentTemplateStatus } from '@/lib/queries/agentTemplate'
import { toast } from 'sonner'

export const createAgentTemplateStatusSlice: StateCreator<
  AgentTemplateStore,
  [],
  [],
  Pick<AgentTemplateStore, 'toggleTemplateStatus' | 'setSelectedTemplate'>
> = (set, get) => ({
  toggleTemplateStatus: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === id ? { ...t, is_active: !t.is_active } : t
        )
      }))

      await toggleAgentTemplateStatus(id)
      
      const template = get().templates.find(t => t.id === id)
      const status = template?.is_active ? 'ativado' : 'desativado'
      toast.success(`Template ${status} com sucesso`)
      
      // Refresh active count
      // get().fetchStats() // TODO: Implement fetchStats if needed
    } catch (error) {
      // Revert optimistic update
      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === id ? { ...t, is_active: !t.is_active } : t
        ),
        error: 'Erro ao alterar status do template'
      }))
      toast.error('Erro ao alterar status do template')
      console.error(error)
    }
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template })
  }
})
