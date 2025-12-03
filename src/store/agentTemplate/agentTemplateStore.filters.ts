import { StateCreator } from 'zustand'
import { AgentTemplateStore } from './agentTemplateStore.types'

export const createAgentTemplateFiltersSlice: StateCreator<
  AgentTemplateStore,
  [],
  [],
  Pick<AgentTemplateStore, 'setSearch' | 'setTypeFilter' | 'setStatusFilter' | 'setPagination' | 'setSort' | 'resetFilters'>
> = (set, get) => ({
  setSearch: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
      pagination: { ...state.pagination, page: 1 } // Reset to first page on search
    }))
    get().fetchTemplates()
  },

  setTypeFilter: (type) => {
    set((state) => ({
      filters: { ...state.filters, type },
      pagination: { ...state.pagination, page: 1 }
    }))
    get().fetchTemplates()
  },

  setStatusFilter: (isActive) => {
    set((state) => ({
      filters: { ...state.filters, is_active: isActive },
      pagination: { ...state.pagination, page: 1 }
    }))
    get().fetchTemplates()
  },

  setPagination: (page, pageSize) => {
    set((state) => ({
      pagination: { ...state.pagination, page, pageSize }
    }))
    get().fetchTemplates()
  },

  setSort: (field, direction) => {
    set({
      sort: { field, direction }
    })
    get().fetchTemplates()
  },

  resetFilters: () => {
    set({
      filters: {},
      pagination: { page: 1, pageSize: 10, total: 0 },
      sort: { field: 'created_at', direction: 'desc' }
    })
    get().fetchTemplates()
  }
})
