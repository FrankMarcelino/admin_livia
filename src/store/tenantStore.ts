/**
 * Tenant Store - Compatibility Layer
 * Re-exporta o store modular para manter compatibilidade com imports existentes
 *
 * NOTA: Este arquivo mantém a API pública inalterada.
 * A implementação real está em src/store/tenant/
 */

export { useTenantStore } from './tenant'
export type { TenantStore } from './tenant'
export { initialFilters, initialSort, initialPagination } from './tenant'
