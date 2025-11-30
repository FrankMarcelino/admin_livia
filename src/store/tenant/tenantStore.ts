/**
 * Tenant Store - Main Store
 * Store Zustand para gerenciamento de estado de tenants
 *
 * Arquitetura modular (cada arquivo < 200 linhas):
 * - tenantStore.types.ts: Interfaces e constantes (75 linhas)
 * - tenantStore.crud.ts: Ações CRUD (183 linhas)
 * - tenantStore.status.ts: Ações de status (96 linhas)
 * - tenantStore.filters.ts: Ações de filtros (67 linhas)
 * - tenantStore.ts: Store principal (este arquivo)
 */

import { create } from 'zustand'
import { TenantStore, initialFilters, initialSort, initialPagination } from './tenantStore.types'
import { createCrudActions } from './tenantStore.crud'
import { createStatusActions } from './tenantStore.status'
import { createFilterActions } from './tenantStore.filters'

/**
 * Tenant Store Hook
 *
 * @example
 * ```tsx
 * function TenantList() {
 *   const { tenants, fetchTenants, isLoading } = useTenantStore()
 *
 *   useEffect(() => {
 *     fetchTenants()
 *   }, [])
 *
 *   return <div>...</div>
 * }
 * ```
 */
export const useTenantStore = create<TenantStore>()((set, get, store) => ({
  // Estado inicial
  tenants: [],
  selectedTenant: null,
  filters: initialFilters,
  sort: initialSort,
  pagination: initialPagination,
  isLoading: false,
  error: null,

  // Ações CRUD (create, read, update, delete)
  ...createCrudActions(set, get, store),

  // Ações de status (activate, deactivate, toggle)
  ...createStatusActions(set, get, store),

  // Ações de filtros, ordenação e seleção
  ...createFilterActions(set, get, store)
}))
