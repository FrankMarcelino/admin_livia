/**
 * Tenant Queries - CRUD Operations
 * Queries de criação, atualização e exclusão de tenants
 */

import { supabase } from '@/lib/supabase'
import { TenantWithRelations } from '@/types/tenant-extended.types'
import { TenantInsert, TenantUpdate } from '@/types/database.types'

/**
 * Cria um novo tenant
 * @param tenant - Dados do tenant a criar
 * @returns Tenant criado
 */
export async function createTenant(tenant: TenantInsert) {
  const { data, error } = await (supabase as any)
    .from('tenants')
    .insert(tenant)
    .select(`
      *,
      neurocore:neurocores!neurocore_id(
        id,
        name,
        is_active
      ),
      niche:niches!niche_id(
        id,
        name
      )
    `)
    .single()

  if (error) {
    console.error('Error creating tenant:', error)
    throw error
  }

  return data as TenantWithRelations
}

/**
 * Atualiza um tenant existente
 * @param tenantId - ID do tenant
 * @param updates - Dados a atualizar
 * @returns Tenant atualizado
 */
export async function updateTenant(tenantId: string, updates: TenantUpdate) {
  const { data, error } = await (supabase as any)
    .from('tenants')
    .update(updates)
    .eq('id', tenantId)
    .select(`
      *,
      neurocore:neurocores!neurocore_id(
        id,
        name,
        is_active
      ),
      niche:niches!niche_id(
        id,
        name
      )
    `)
    .single()

  if (error) {
    console.error('Error updating tenant:', error)
    throw error
  }

  return data as TenantWithRelations
}

/**
 * Desativa um tenant (soft delete)
 * @param tenantId - ID do tenant
 * @returns Tenant desativado
 */
export async function deactivateTenant(tenantId: string) {
  return updateTenant(tenantId, { is_active: false })
}

/**
 * Ativa um tenant
 * @param tenantId - ID do tenant
 * @returns Tenant ativado
 */
export async function activateTenant(tenantId: string) {
  return updateTenant(tenantId, { is_active: true })
}

/**
 * Alterna o status da integração master
 * @param tenantId - ID do tenant
 * @param status - Novo status da integração master
 * @returns Tenant atualizado
 */
export async function toggleMasterIntegration(tenantId: string, status: boolean) {
  return updateTenant(tenantId, { master_integration_active: status })
}
