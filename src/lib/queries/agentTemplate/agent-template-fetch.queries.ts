import { supabase } from '@/lib/supabase'
import type { AgentTemplate } from '@/types/agent-template-extended.types'
import type { AgentFunction } from '@/types/database.types'

/**
 * Parameters for fetching agent templates with filters and pagination
 */
export interface FetchAgentTemplatesParams {
  search?: string
  type?: AgentFunction
  isActive?: boolean
  limit?: number
  offset?: number
}

/**
 * Fetch agent templates with optional filters and pagination
 * 
 * @param params - Filter and pagination parameters
 * @returns Promise with templates array and total count
 */
export async function fetchAgentTemplates(params: FetchAgentTemplatesParams = {}) {
  let query = supabase
    .from('agent_templates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply search filter (case-insensitive name search)
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  // Apply type filter
  if (params.type) {
    query = query.eq('type', params.type)
  }

  // Apply active status filter
  if (params.isActive !== undefined) {
    query = query.eq('is_active', params.isActive)
  }

  // Apply pagination
  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset !== undefined) {
    const limit = params.limit || 10
    query = query.range(params.offset, params.offset + limit - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching agent templates:', error)
    throw error
  }

  return {
    data: (data as AgentTemplate[]) || [],
    count: count || 0
  }
}

/**
 * Fetch a single agent template by ID
 * 
 * @param id - Template UUID
 * @returns Promise with template data
 */
export async function fetchAgentTemplateById(id: string) {
  const { data, error } = await supabase
    .from('agent_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching agent template by ID:', error)
    throw error
  }

  return data as AgentTemplate
}

/**
 * Fetch only active agent templates (for template selector)
 * Ordered by name for better UX
 * 
 * @returns Promise with active templates array
 */
export async function fetchActiveAgentTemplates() {
  const { data, error } = await supabase
    .from('agent_templates')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching active agent templates:', error)
    throw error
  }

  return (data as AgentTemplate[]) || []
}
