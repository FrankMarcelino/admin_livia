/**
 * Tenant Store - Filter & Selection Actions
 * Ações para gerenciar filtros, ordenação, paginação e seleção
 */

import { StateCreator } from 'zustand'
import { TenantStore, initialFilters, initialPagination, initialSort } from './tenantStore.types'

type FilterActions = Pick<TenantStore,
  'setFilters' | 'setSort' | 'setPagination' | 'clearFilters' | 'selectTenant' | 'reset'
>

export const createFilterActions: StateCreator<TenantStore, [], [], FilterActions> = (set, get) => ({
  // Definir filtros
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 } // Reset para página 1
    }))
    // Buscar tenants com novos filtros
    get().fetchTenants()
  },

  // Definir ordenação
  setSort: (sort) => {
    set({ sort })
    // Buscar tenants com nova ordenação
    get().fetchTenants()
  },

  // Definir paginação
  setPagination: (pagination) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination }
    }))
    // Buscar tenants com nova paginação
    get().fetchTenants()
  },

  // Limpar filtros
  clearFilters: () => {
    set({
      filters: initialFilters,
      pagination: initialPagination
    })
    // Buscar tenants sem filtros
    get().fetchTenants()
  },

  // Selecionar tenant
  selectTenant: (tenant) => {
    set({ selectedTenant: tenant })
  },

  // Reset do estado
  reset: () => {
    set({
      tenants: [],
      selectedTenant: null,
      filters: initialFilters,
      sort: initialSort,
      pagination: initialPagination,
      isLoading: false,
      error: null
    })
  }
})
