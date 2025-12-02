/**
 * Neurocore Queries - Fetch Operations
 * Queries de leitura/busca de neurocores
 */

import { supabase } from '@/lib/supabase'
import { NeurocoreWithRelations, NeurocoreFilters, NeurocoreSort } from '@/types/neurocore-extended.types'

/**
 * Busca neurocores com relacionamentos populados (agents)
 * @param filters - Filtros a aplicar
 * @param sort - Ordenação
 * @param page - Página atual (1-indexed)
 * @param pageSize - Tamanho da página
 * @returns Lista de neurocores com total de registros
 */
export async function fetchNeurocoresWithRelations(
  filters?: NeurocoreFilters,
  sort?: NeurocoreSort,
  page = 1,
  pageSize = 10
) {
  let query = supabase
    .from('neurocores')
    .select(`
      *,
      agents (*)
    `, { count: 'exact' })

  // Aplicar filtros
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  // Aplicar ordenação
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  // Aplicar paginação
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching neurocores:', error)
    throw error
  }

  // Enriquecer neurocores com estatísticas de tenants
  const neurocoresWithStats = await Promise.all(
    (data || []).map(async (neurocore: any) => {
      // Contar tenants que usam este neurocore
      const { count: tenantCount } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true })
        .eq('neurocore_id', neurocore.id)

      return {
        ...neurocore,
        stats: {
          total_agents: neurocore.agents?.length || 0,
          total_tenants: tenantCount || 0
        }
      }
    })
  )

  // Debug: Log dos neurocores e agents carregados
  console.log('📊 Neurocores carregados:', neurocoresWithStats.length)
  neurocoresWithStats.forEach((nc: any) => {
    console.log(`  - ${nc.name}: ${nc.agents?.length || 0} agents, ${nc.stats?.total_tenants || 0} tenants`)
  })

  return {
    data: neurocoresWithStats as NeurocoreWithRelations[],
    total: count || 0
  }
}

/**
 * Busca um neurocore específico por ID com relacionamentos
 * @param neurocoreId - ID do neurocore
 * @returns Neurocore com relacionamentos ou null
 */
export async function fetchNeurocoreById(neurocoreId: string) {
  const { data, error } = await supabase
    .from('neurocores')
    .select(`
      *,
      agents (*)
    `)
    .eq('id', neurocoreId)
    .single()

  if (error) {
    console.error('Error fetching neurocore:', error)
    throw error
  }

  return data as NeurocoreWithRelations | null
}

/**
 * Busca neurocore com estatísticas (contagem de agents e tenants)
 * @param neurocoreId - ID do neurocore
 * @returns Neurocore com estatísticas
 */
export async function fetchNeurocoreWithStats(neurocoreId: string) {
  // Buscar neurocore com agents
  const { data: neurocore, error: neurocoreError } = await supabase
    .from('neurocores')
    .select(`
      *,
      agents (*)
    `)
    .eq('id', neurocoreId)
    .single()

  if (neurocoreError) {
    console.error('Error fetching neurocore:', neurocoreError)
    throw neurocoreError
  }

  if (!neurocore) {
    return null
  }

  // Contar tenants que usam este neurocore
  const { count: tenantCount, error: tenantError } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('neurocore_id', neurocoreId)

  if (tenantError) {
    console.error('Error counting tenants:', tenantError)
    throw tenantError
  }

  // Cast para tipo correto
  const neurocoreData = neurocore as any

  const neurocoreWithStats: NeurocoreWithRelations = {
    ...neurocoreData,
    stats: {
      total_agents: neurocoreData.agents?.length || 0,
      total_tenants: tenantCount || 0
    }
  }

  return neurocoreWithStats
}

/**
 * Verifica se um ID de Workflow N8N já existe no banco de dados
 * @param workflowId - ID do Workflow N8N a verificar
 * @param excludeId - ID do neurocore a excluir da busca (para edição)
 * @returns true se ID já existe
 */
export async function checkWorkflowIdExists(workflowId: string, excludeId?: string) {
  let query = supabase
    .from('neurocores')
    .select('id')
    .eq('id_subwork_n8n_neurocore', workflowId)
    .limit(1)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking workflow ID:', error)
    throw error
  }

  return (data?.length || 0) > 0
}
