import { AgentFunction } from './database.types'

/**
 * Guideline step structure for agent templates
 * Each step has a title and an array of instructions
 */
export interface GuidelineStep {
  title: string
  steps: string[]
}

/**
 * Agent Template - Master configuration created by Super Admin
 * Can be reused across multiple neurocores
 */
export interface AgentTemplate {
  id: string
  
  // Technical Structure
  name: string
  type: AgentFunction
  reactive: boolean
  
  // Persona Information
  persona_name: string | null
  age: string | null
  gender: string | null
  objective: string | null
  communication: string | null
  personality: string | null
  
  // Complex Configurations (JSONB)
  limitations: string[] | null
  rules: any | null
  instructions: string[] | null
  guide_line: GuidelineStep[] | null
  others_instructions: any | null
  
  // Metadata
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

/**
 * Agent Template with usage statistics
 * Used for display in details drawer
 */
export interface AgentTemplateWithStats extends AgentTemplate {
  neurocores_count: number
  tenants_count: number
}

/**
 * Input for creating a new agent template
 */
export interface AgentTemplateCreateInput {
  name: string
  type: AgentFunction
  reactive: boolean
  persona_name?: string
  age?: string
  gender?: string
  objective?: string
  communication?: string
  personality?: string
  limitations?: string[]
  rules?: any
  instructions?: string[]
  guide_line?: GuidelineStep[]
  others_instructions?: any
}

/**
 * Input for updating an existing agent template
 */
export interface AgentTemplateUpdateInput extends Partial<AgentTemplateCreateInput> {}

/**
 * Filters for listing agent templates
 */
export interface AgentTemplateFilters {
  search?: string           // Search by name
  type?: AgentFunction      // Filter by agent type
  is_active?: boolean       // Filter by active status
}

/**
 * Sorting options for agent templates
 */
export interface AgentTemplateSort {
  field: 'name' | 'created_at' | 'updated_at' | 'type'
  direction: 'asc' | 'desc'
}

/**
 * Pagination for agent templates
 */
export interface AgentTemplatePagination {
  page: number
  pageSize: number
  total: number
}

/**
 * Complete state for agent template list view
 */
export interface AgentTemplateListState {
  templates: AgentTemplate[]
  filters: AgentTemplateFilters
  sort: AgentTemplateSort
  pagination: AgentTemplatePagination
  isLoading: boolean
  error: string | null
}
