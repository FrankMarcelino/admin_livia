import { Neurocore, Agent } from './database.types'

/**
 * Neurocore com relacionamentos populados (para exibição)
 */
export interface NeurocoreWithRelations extends Neurocore {
  agents?: Agent[]

  // Estatísticas calculadas
  stats?: {
    total_agents: number
    total_tenants: number  // Quantos tenants usam este neurocore
  }
}

/**
 * Filtros para listagem de neurocores
 */
export interface NeurocoreFilters {
  search?: string  // Busca por nome ou descrição
  is_active?: boolean
}

/**
 * Ordenação de neurocores
 */
export interface NeurocoreSort {
  field: 'name' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
}

/**
 * Paginação
 */
export interface NeurocorePagination {
  page: number
  pageSize: number
  total: number
}
