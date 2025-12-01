/**
 * Neurocore Store - Main Store
 * Store Zustand para gerenciamento de estado de neurocores
 *
 * Arquitetura modular (cada arquivo < 200 linhas):
 * - neurocoreStore.types.ts: Interfaces e constantes
 * - neurocoreStore.crud.ts: Ações CRUD de neurocores
 * - neurocoreStore.status.ts: Ações de status (activate/deactivate)
 * - neurocoreStore.agents.ts: Ações CRUD de agents
 * - neurocoreStore.filters.ts: Ações de filtros e seleção
 * - neurocoreStore.ts: Store principal (este arquivo)
 */

import { create } from 'zustand'
import { NeurocoreStore, initialFilters, initialSort, initialPagination } from './neurocoreStore.types'
import { createCrudActions } from './neurocoreStore.crud'
import { createStatusActions } from './neurocoreStore.status'
import { createAgentActions } from './neurocoreStore.agents'
import { createFilterActions } from './neurocoreStore.filters'

/**
 * Neurocore Store Hook
 *
 * @example
 * ```tsx
 * function NeurocoreList() {
 *   const { neurocores, fetchNeurocores, isLoading } = useNeurocoreStore()
 *
 *   useEffect(() => {
 *     fetchNeurocores()
 *   }, [])
 *
 *   return <div>...</div>
 * }
 * ```
 */
export const useNeurocoreStore = create<NeurocoreStore>()((set, get, store) => ({
  // Estado inicial
  neurocores: [],
  selectedNeurocore: null,
  filters: initialFilters,
  sort: initialSort,
  pagination: initialPagination,
  isLoading: false,
  error: null,

  // Ações CRUD (create, read, update, delete)
  ...createCrudActions(set, get, store),

  // Ações de status (activate, deactivate, toggle)
  ...createStatusActions(set, get, store),

  // Ações de agents (create, update, delete)
  ...createAgentActions(set, get, store),

  // Ações de filtros, ordenação e seleção
  ...createFilterActions(set, get, store)
}))
