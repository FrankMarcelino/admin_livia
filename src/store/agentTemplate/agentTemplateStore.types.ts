import {
  AgentTemplate,
  AgentTemplateCreateInput,
  AgentTemplateUpdateInput,
  AgentTemplateFilters,
  AgentTemplateSort,
  AgentTemplatePagination
} from '@/types/agent-template-extended.types'

/**
 * State interface for Agent Template Store
 */
export interface AgentTemplateState {
  // Data
  templates: AgentTemplate[]
  selectedTemplate: AgentTemplate | null
  totalCount: number
  activeCount: number
  
  // UI State
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  
  // Filters & Pagination
  filters: AgentTemplateFilters
  sort: AgentTemplateSort
  pagination: AgentTemplatePagination
}

/**
 * Actions interface for Agent Template Store
 */
export interface AgentTemplateActions {
  // CRUD Actions
  fetchTemplates: () => Promise<void>
  fetchTemplateById: (id: string) => Promise<void>
  createTemplate: (input: AgentTemplateCreateInput) => Promise<void>
  updateTemplate: (id: string, input: AgentTemplateUpdateInput) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  
  // Status Actions
  toggleTemplateStatus: (id: string) => Promise<void>
  setSelectedTemplate: (template: AgentTemplate | null) => void
  
  // Filter & Pagination Actions
  setSearch: (search: string) => void
  setTypeFilter: (type: AgentTemplateFilters['type']) => void
  setStatusFilter: (isActive: boolean | undefined) => void
  setPagination: (page: number, pageSize: number) => void
  setSort: (field: AgentTemplateSort['field'], direction: AgentTemplateSort['direction']) => void
  resetFilters: () => void
}

/**
 * Combined Store Interface
 */
export interface AgentTemplateStore extends AgentTemplateState, AgentTemplateActions {}
