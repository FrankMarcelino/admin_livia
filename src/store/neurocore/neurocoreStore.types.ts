/**
 * Neurocore Store - Types & Interfaces
 * Tipos, interfaces e constantes do store de neurocores
 */

import { NeurocoreWithRelations, NeurocoreFilters, NeurocoreSort, NeurocorePagination } from '@/types/neurocore-extended.types'
import { NeurocoreInsert, NeurocoreUpdate, Agent, AgentInsert, AgentUpdate } from '@/types/database.types'

/**
 * Interface do Neurocore Store (Zustand)
 */
export interface NeurocoreStore {
  // Estado
  neurocores: NeurocoreWithRelations[]
  selectedNeurocore: NeurocoreWithRelations | null
  filters: NeurocoreFilters
  sort: NeurocoreSort
  pagination: NeurocorePagination
  isLoading: boolean
  error: string | null

  // Ações de Leitura (Neurocores)
  fetchNeurocores: () => Promise<void>
  fetchNeurocoreById: (id: string) => Promise<void>

  // Ações de Escrita (Neurocores)
  createNeurocore: (data: NeurocoreInsert) => Promise<NeurocoreWithRelations | null>
  updateNeurocore: (id: string, data: NeurocoreUpdate) => Promise<NeurocoreWithRelations | null>
  deleteNeurocore: (id: string) => Promise<void>

  // Ações de Status (Neurocores)
  activateNeurocore: (id: string) => Promise<void>
  deactivateNeurocore: (id: string) => Promise<void>
  toggleNeurocoreStatus: (id: string, status: boolean) => Promise<void>

  // Ações de Agents
  createAgent: (data: AgentInsert) => Promise<Agent | null>
  updateAgent: (id: string, data: AgentUpdate) => Promise<Agent | null>
  deleteAgent: (id: string) => Promise<void>

  // Ações de Filtro/Busca
  setFilters: (filters: Partial<NeurocoreFilters>) => void
  setSort: (sort: NeurocoreSort) => void
  setPagination: (pagination: Partial<NeurocorePagination>) => void
  clearFilters: () => void

  // Ações de Seleção
  selectNeurocore: (neurocore: NeurocoreWithRelations | null) => void

  // Reset
  reset: () => void
}

/**
 * Estado inicial dos filtros
 */
export const initialFilters: NeurocoreFilters = {
  search: '',
  is_active: undefined
}

/**
 * Estado inicial da ordenação
 */
export const initialSort: NeurocoreSort = {
  field: 'created_at',
  direction: 'desc'
}

/**
 * Estado inicial da paginação
 */
export const initialPagination: NeurocorePagination = {
  page: 1,
  pageSize: 10,
  total: 0
}
