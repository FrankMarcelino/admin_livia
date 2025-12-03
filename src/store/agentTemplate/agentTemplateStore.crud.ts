import { StateCreator } from 'zustand'
import { AgentTemplateStore } from './agentTemplateStore.types'
import {
  fetchAgentTemplates,
  fetchAgentTemplateById,
  createAgentTemplate,
  updateAgentTemplate,
  deleteAgentTemplate,
  getTotalTemplatesCount,
  getActiveTemplatesCount
} from '@/lib/queries/agentTemplate'
import { toast } from 'sonner'

export const createAgentTemplateCrudSlice: StateCreator<
  AgentTemplateStore,
  [],
  [],
  Pick<AgentTemplateStore, 'fetchTemplates' | 'fetchTemplateById' | 'createTemplate' | 'updateTemplate' | 'deleteTemplate'>
> = (set, get) => ({
  fetchTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters, pagination } = get()

      // Calculate offset
      const offset = (pagination.page - 1) * pagination.pageSize
      
      const { data, count } = await fetchAgentTemplates({
        search: filters.search,
        type: filters.type,
        isActive: filters.is_active,
        limit: pagination.pageSize,
        offset
      })

      // Fetch counts for stats
      const totalCount = await getTotalTemplatesCount()
      const activeCount = await getActiveTemplatesCount()

      set((state) => ({
        templates: data,
        totalCount,
        activeCount,
        pagination: {
          ...state.pagination,
          total: count
        },
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Erro ao carregar templates', isLoading: false })
      console.error(error)
      toast.error('Erro ao carregar templates')
    }
  },

  fetchTemplateById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const template = await fetchAgentTemplateById(id)
      set({ selectedTemplate: template, isLoading: false })
    } catch (error) {
      set({ error: 'Erro ao carregar detalhes do template', isLoading: false })
      console.error(error)
      toast.error('Erro ao carregar detalhes do template')
    }
  },

  createTemplate: async (input) => {
    set({ isSubmitting: true, error: null })
    try {
      await createAgentTemplate(input)
      toast.success('Template criado com sucesso')
      get().fetchTemplates()
      set({ isSubmitting: false })
    } catch (error) {
      set({ error: 'Erro ao criar template', isSubmitting: false })
      console.error(error)
      toast.error('Erro ao criar template')
      throw error
    }
  },

  updateTemplate: async (id, input) => {
    set({ isSubmitting: true, error: null })
    try {
      await updateAgentTemplate(id, input)
      toast.success('Template atualizado com sucesso')
      get().fetchTemplates()
      
      // Update selected template if it's the one being edited
      const selected = get().selectedTemplate
      if (selected && selected.id === id) {
        get().fetchTemplateById(id)
      }
      
      set({ isSubmitting: false })
    } catch (error) {
      set({ error: 'Erro ao atualizar template', isSubmitting: false })
      console.error(error)
      toast.error('Erro ao atualizar template')
      throw error
    }
  },

  deleteTemplate: async (id) => {
    set({ isSubmitting: true, error: null })
    try {
      await deleteAgentTemplate(id)
      toast.success('Template removido com sucesso')
      get().fetchTemplates()
      set({ isSubmitting: false })
    } catch (error) {
      set({ error: 'Erro ao remover template', isSubmitting: false })
      console.error(error)
      toast.error('Erro ao remover template')
      throw error
    }
  }
})
