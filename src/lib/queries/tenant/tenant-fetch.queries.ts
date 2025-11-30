/**
 * Tenant Queries - Fetch Operations
 * Queries de leitura/busca de tenants
 */

import { supabase } from '@/lib/supabase'
import { TenantWithRelations, TenantFilters, TenantSort } from '@/types/tenant-extended.types'

/**
 * Busca tenants com relacionamentos populados (neurocore e niche)
 * @param filters - Filtros a aplicar
 * @param sort - Ordenação
 * @param page - Página atual (1-indexed)
 * @param pageSize - Tamanho da página
 * @returns Lista de tenants com total de registros
 */
export async function fetchTenantsWithRelations(
  filters?: TenantFilters,
  sort?: TenantSort,
  page = 1,
  pageSize = 10
) {
  let query = supabase
    .from('tenants')
    .select(`
      *,
      neurocore:neurocores!neurocore_id(
        id,
        name,
        is_active
      ),
      niche:niches(
        id,
        name
      )
    `, { count: 'exact' })

  // Aplicar filtros
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  if (filters?.plan && filters.plan.length > 0) {
    query = query.in('plan', filters.plan)
  }

  if (filters?.niche_id) {
    query = query.eq('niche_id', filters.niche_id)
  }

  if (filters?.neurocore_id) {
    query = query.eq('neurocore_id', filters.neurocore_id)
  }

  // Aplicar ordenação
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  // Aplicar paginação
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }

  return {
    data: (data || []) as TenantWithRelations[],
    total: count || 0
  }
}

/**
 * Busca um tenant específico por ID com relacionamentos
 * @param tenantId - ID do tenant
 * @returns Tenant com relacionamentos ou null
 */
export async function fetchTenantById(tenantId: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      *,
      neurocore:neurocores!neurocore_id(
        id,
        name,
        is_active
      ),
      niche:niches(
        id,
        name
      )
    `)
    .eq('id', tenantId)
    .single()

  if (error) {
    console.error('Error fetching tenant:', error)
    throw error
  }

  return data as TenantWithRelations | null
}

/**
 * Verifica se um CNPJ já existe no banco de dados
 * @param cnpj - CNPJ a verificar
 * @param excludeId - ID do tenant a excluir da busca (para edição)
 * @returns true se CNPJ já existe
 */
export async function checkCNPJExists(cnpj: string, excludeId?: string) {
  let query = supabase
    .from('tenants')
    .select('id')
    .eq('cnpj', cnpj)
    .limit(1)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking CNPJ:', error)
    throw error
  }

  return (data?.length || 0) > 0
}
