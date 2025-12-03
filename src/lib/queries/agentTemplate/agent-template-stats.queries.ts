import { supabase } from '@/lib/supabase'

/**
 * Get usage statistics for a specific agent template
 * 
 * Note: This is a placeholder for future implementation.
 * To track template usage, we need to add a `template_id` field to the `agents` table.
 * For MVP, this returns mock data.
 * 
 * @param templateId - Template UUID
 * @returns Promise with usage statistics
 */
export async function getAgentTemplateUsageStats(_templateId: string) {
  // TODO: Implement tracking when template_id is added to agents table
  // For now, return zero counts
  
  // Future implementation:
  // 1. Count agents created from this template:
  //    SELECT COUNT(DISTINCT id_neurocore) FROM agents WHERE template_id = templateId
  // 2. Count tenants using these agents:
  //    SELECT COUNT(DISTINCT id_tenant) FROM agent_prompts 
  //    WHERE id_agent IN (SELECT id FROM agents WHERE template_id = templateId)
  
  return {
    neurocores_count: 0,
    tenants_count: 0
  }
}

/**
 * Get total count of all agent templates
 * 
 * @returns Promise with total count
 */
export async function getTotalTemplatesCount() {
  const { count, error } = await supabase
    .from('agent_templates')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error getting total templates count:', error)
    throw error
  }

  return count || 0
}

/**
 * Get count of active agent templates
 * 
 * @returns Promise with active count
 */
export async function getActiveTemplatesCount() {
  const { count, error } = await supabase
    .from('agent_templates')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (error) {
    console.error('Error getting active templates count:', error)
    throw error
  }

  return count || 0
}
