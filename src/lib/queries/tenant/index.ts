/**
 * Tenant Queries - Public API
 * Re-exporta todas as queries de tenant de forma organizada
 */

// Fetch Operations
export {
  fetchTenantsWithRelations,
  fetchTenantById,
  checkCNPJExists
} from './tenant-fetch.queries'

// CRUD Operations
export {
  createTenant,
  updateTenant,
  deactivateTenant,
  activateTenant,
  toggleMasterIntegration
} from './tenant-crud.queries'

// Statistics & Relationships
export {
  fetchTenantStats,
  fetchTenantChannels
} from './tenant-stats.queries'

// Lookup Tables
export {
  fetchActiveNeurocores,
  fetchNiches
} from './tenant-lookups.queries'
