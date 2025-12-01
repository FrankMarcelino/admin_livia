/**
 * Neurocore Store - Filter Actions
 * Ações para gerenciar filtros, ordenação, paginação e seleção
 */

import { StateCreator } from 'zustand'
import { NeurocoreStore, initialFilters, initialSort, initialPagination } from './neurocoreStore.types'
import { NeurocoreWithRelations, NeurocoreFilters, NeurocoreSort, NeurocorePagination } from '@/types/neurocore-extended.types'

type FilterActions = Pick<NeurocoreStore,
  'setFilters' | 'setSort' | 'setPagination' | 'clearFilters' | 'selectNeurocore' | 'reset'
>

export const createFilterActions: StateCreator<NeurocoreStore, [], [], FilterActions> = (set, get) => ({
  // Atualizar filtros (parcial)
  setFilters: (filters: Partial<NeurocoreFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 } // Reset para página 1 ao filtrar
    }))
    // Buscar neurocores com novos filtros
    get().fetchNeurocores()
  },

  // Atualizar ordenação
  setSort: (sort: NeurocoreSort) => {
    set({ sort })
    // Buscar neurocores com nova ordenação
    get().fetchNeurocores()
  },

  // Atualizar paginação (parcial)
  setPagination: (pagination: Partial<NeurocorePagination>) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination }
    }))
    // Buscar neurocores com nova paginação
    get().fetchNeurocores()
  },

  // Limpar filtros
  clearFilters: () => {
    set({
      filters: initialFilters,
      sort: initialSort,
      pagination: initialPagination
    })
    // Buscar neurocores sem filtros
    get().fetchNeurocores()
  },

  // Selecionar neurocore
  selectNeurocore: (neurocore: NeurocoreWithRelations | null) => {
    set({ selectedNeurocore: neurocore })
  },

  // Reset completo do store
  reset: () => {
    set({
      neurocores: [],
      selectedNeurocore: null,
      filters: initialFilters,
      sort: initialSort,
      pagination: initialPagination,
      isLoading: false,
      error: null
    })
  }
})
