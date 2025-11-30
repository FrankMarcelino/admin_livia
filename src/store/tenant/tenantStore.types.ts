/**
 * Tenant Store - Types & Interfaces
 * Tipos, interfaces e constantes do store de tenants
 */

import { TenantWithRelations, TenantFilters, TenantSort, TenantPagination } from '@/types/tenant-extended.types'
import { TenantInsert, TenantUpdate } from '@/types/database.types'

/**
 * Interface do Tenant Store (Zustand)
 */
export interface TenantStore {
  // Estado
  tenants: TenantWithRelations[]
  selectedTenant: TenantWithRelations | null
  filters: TenantFilters
  sort: TenantSort
  pagination: TenantPagination
  isLoading: boolean
  error: string | null

  // Ações de Leitura
  fetchTenants: () => Promise<void>
  fetchTenantById: (id: string) => Promise<void>

  // Ações de Escrita
  createTenant: (data: TenantInsert) => Promise<TenantWithRelations | null>
  updateTenant: (id: string, data: TenantUpdate) => Promise<TenantWithRelations | null>
  deleteTenant: (id: string) => Promise<void>

  // Ações de Filtro/Busca
  setFilters: (filters: Partial<TenantFilters>) => void
  setSort: (sort: TenantSort) => void
  setPagination: (pagination: Partial<TenantPagination>) => void
  clearFilters: () => void

  // Ações de Seleção
  selectTenant: (tenant: TenantWithRelations | null) => void

  // Ações de Status
  activateTenant: (id: string) => Promise<void>
  deactivateTenant: (id: string) => Promise<void>
  toggleMasterIntegration: (id: string, status: boolean) => Promise<void>

  // Reset
  reset: () => void
}

/**
 * Estado inicial dos filtros
 */
export const initialFilters: TenantFilters = {
  search: '',
  plan: [],
  is_active: undefined,
  niche_id: undefined,
  neurocore_id: undefined
}

/**
 * Estado inicial da ordenação
 */
export const initialSort: TenantSort = {
  field: 'created_at',
  direction: 'desc'
}

/**
 * Estado inicial da paginação
 */
export const initialPagination: TenantPagination = {
  page: 1,
  pageSize: 10,
  total: 0
}
