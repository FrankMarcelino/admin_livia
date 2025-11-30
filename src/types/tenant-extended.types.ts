import { Tenant, Neurocore, Niche, TenantPlan } from './database.types'

/**
 * Tenant com relacionamentos populados (para exibição)
 */
export interface TenantWithRelations extends Tenant {
  neurocore: Pick<Neurocore, 'id' | 'name' | 'is_active'>
  niche: Pick<Niche, 'id' | 'name'> | null
  
  // Estatísticas calculadas
  stats?: {
    total_users: number
    total_contacts: number
    total_conversations: number
    total_channels: number
  }
}

/**
 * Filtros para listagem de tenants
 */
export interface TenantFilters {
  search?: string // Busca por nome ou CNPJ
  plan?: TenantPlan[]
  is_active?: boolean
  niche_id?: string
  neurocore_id?: string
}

/**
 * Ordenação de tenants
 */
export interface TenantSort {
  field: 'name' | 'created_at' | 'updated_at' | 'plan'
  direction: 'asc' | 'desc'
}

/**
 * Paginação
 */
export interface TenantPagination {
  page: number
  pageSize: number
  total: number
}
