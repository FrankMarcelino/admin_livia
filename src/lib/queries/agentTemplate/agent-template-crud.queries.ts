import { supabase } from '@/lib/supabase'
import type {
  AgentTemplateCreateInput,
  AgentTemplateUpdateInput
} from '@/types/agent-template-extended.types'

/**
 * Create a new agent template
 * 
 * @param input - Template data
 * @returns Promise with created template
 */
export async function createAgentTemplate(input: AgentTemplateCreateInput) {
  // Get current user ID for created_by field
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('agent_templates')
    // @ts-expect-error - Table exists but types not regenerated yet
    .insert([{
      ...input,
      created_by: user?.id || null
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating agent template:', error)
    throw error
  }

  return data
}

/**
 * Update an existing agent template
 * 
 * @param id - Template UUID
 * @param input - Partial template data to update
 * @returns Promise with updated template
 */
export async function updateAgentTemplate(
  id: string,
  input: AgentTemplateUpdateInput
) {
  const { data, error } = await supabase
    .from('agent_templates')
    // @ts-expect-error - Table exists but types not regenerated yet
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating agent template:', error)
    throw error
  }

  return data
}

/**
 * Soft delete an agent template (set is_active to false)
 * Does not actually delete the record to preserve data integrity
 * 
 * @param id - Template UUID
 * @returns Promise with updated template
 */
export async function deleteAgentTemplate(id: string) {
  const { data, error } = await supabase
    .from('agent_templates')
    // @ts-expect-error - Table exists but types not regenerated yet
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deleting agent template:', error)
    throw error
  }

  return data
}

/**
 * Toggle agent template active status
 * 
 * @param id - Template UUID
 * @returns Promise with updated template
 */
export async function toggleAgentTemplateStatus(id: string) {
  // First, fetch current status
  const { data: current, error: fetchError } = await supabase
    .from('agent_templates')
    .select('is_active')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching agent template status:', fetchError)
    throw fetchError
  }

  // Toggle the status
  const { data, error } = await supabase
    .from('agent_templates')
    // @ts-expect-error - Table exists but types not regenerated yet
    .update({ is_active: !(current as any).is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling agent template status:', error)
    throw error
  }

  return data
}
