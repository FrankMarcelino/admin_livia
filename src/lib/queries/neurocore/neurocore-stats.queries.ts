/**
 * Neurocore Queries - Statistics
 * Queries de estatísticas e agregações de neurocores
 */

import { supabase } from '@/lib/supabase'

/**
 * Conta quantos tenants usam um neurocore específico
 * @param neurocoreId - ID do neurocore
 * @returns Número de tenants usando o neurocore
 */
export async function countTenantsByNeurocore(neurocoreId: string): Promise<number> {
  const { count, error } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('neurocore_id', neurocoreId)

  if (error) {
    console.error('Error counting tenants:', error)
    throw error
  }

  return count || 0
}

/**
 * Conta quantos agents pertencem a um neurocore específico
 * @param neurocoreId - ID do neurocore
 * @returns Número de agents no neurocore
 */
export async function countAgentsByNeurocore(neurocoreId: string): Promise<number> {
  const { count, error } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('id_neurocore', neurocoreId)

  if (error) {
    console.error('Error counting agents:', error)
    throw error
  }

  return count || 0
}

/**
 * Busca estatísticas completas de um neurocore
 * @param neurocoreId - ID do neurocore
 * @returns Objeto com estatísticas
 */
export async function fetchNeurocoreStats(neurocoreId: string) {
  const [tenantCount, agentCount] = await Promise.all([
    countTenantsByNeurocore(neurocoreId),
    countAgentsByNeurocore(neurocoreId)
  ])

  return {
    total_tenants: tenantCount,
    total_agents: agentCount
  }
}
