import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AgentTemplateStore } from './agentTemplateStore.types'
import { createAgentTemplateCrudSlice } from './agentTemplateStore.crud'
import { createAgentTemplateFiltersSlice } from './agentTemplateStore.filters'
import { createAgentTemplateStatusSlice } from './agentTemplateStore.status'

export const useAgentTemplateStore = create<AgentTemplateStore>()(
  devtools(
    (...a) => ({
      // Initial State
      templates: [],
      selectedTemplate: null,
      totalCount: 0,
      activeCount: 0,
      isLoading: false,
      isSubmitting: false,
      error: null,
      
      filters: {},
      sort: {
        field: 'created_at',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },

      // Slices
      ...createAgentTemplateCrudSlice(...a),
      ...createAgentTemplateFiltersSlice(...a),
      ...createAgentTemplateStatusSlice(...a)
    }),
    { name: 'agent-template-store' }
  )
)
