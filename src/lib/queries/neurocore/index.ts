/**
 * Neurocore Queries - Public API
 * Re-exporta todas as queries de neurocore de forma organizada
 */

// Fetch Operations
export {
  fetchNeurocoresWithRelations,
  fetchNeurocoreById,
  fetchNeurocoreWithStats,
  checkWorkflowIdExists
} from './neurocore-fetch.queries'

// CRUD Operations
export {
  createNeurocore,
  updateNeurocore,
  deleteNeurocore,
  deactivateNeurocore,
  activateNeurocore,
  toggleNeurocoreStatus
} from './neurocore-crud.queries'

// Statistics
export {
  countTenantsByNeurocore,
  countAgentsByNeurocore,
  fetchNeurocoreStats
} from './neurocore-stats.queries'

// Agent CRUD Operations
export {
  createAgent,
  updateAgent,
  deleteAgent,
  fetchAgentsByNeurocore
} from './agent-crud.queries'
