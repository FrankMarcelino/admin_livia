/**
 * Neurocore Queries - CRUD Operations
 * Queries de criação, atualização e exclusão de neurocores
 */

import { supabase } from '@/lib/supabase'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import { NeurocoreInsert, NeurocoreUpdate } from '@/types/database.types'

/**
 * Cria um novo neurocore
 * @param neurocore - Dados do neurocore a criar
 * @returns Neurocore criado
 */
export async function createNeurocore(neurocore: NeurocoreInsert) {
  const { data, error } = await (supabase as any)
    .from('neurocores')
    .insert(neurocore)
    .select(`
      *,
      agents (*)
    `)
    .single()

  if (error) {
    console.error('Error creating neurocore:', error)
    throw error
  }

  return data as NeurocoreWithRelations
}

/**
 * Atualiza um neurocore existente
 * @param neurocoreId - ID do neurocore
 * @param updates - Dados a atualizar
 * @returns Neurocore atualizado
 */
export async function updateNeurocore(neurocoreId: string, updates: NeurocoreUpdate) {
  const { data, error } = await (supabase as any)
    .from('neurocores')
    .update(updates)
    .eq('id', neurocoreId)
    .select(`
      *,
      agents (*)
    `)
    .single()

  if (error) {
    console.error('Error updating neurocore:', error)
    throw error
  }

  return data as NeurocoreWithRelations
}

/**
 * Deleta um neurocore
 * IMPORTANTE: Verificar se não há tenants usando antes de deletar!
 * Agents serão deletados automaticamente via CASCADE FK
 * @param neurocoreId - ID do neurocore
 */
export async function deleteNeurocore(neurocoreId: string) {
  // Primeiro verificar se há tenants usando
  const { count: tenantCount, error: countError } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('neurocore_id', neurocoreId)

  if (countError) {
    console.error('Error checking tenants:', countError)
    throw countError
  }

  if (tenantCount && tenantCount > 0) {
    throw new Error(
      `Não é possível excluir. ${tenantCount} tenant(s) estão usando este neurocore.`
    )
  }

  // Se não houver tenants, deletar neurocore
  // Agents serão deletados automaticamente via CASCADE FK
  const { error } = await supabase
    .from('neurocores')
    .delete()
    .eq('id', neurocoreId)

  if (error) {
    console.error('Error deleting neurocore:', error)
    throw error
  }
}

/**
 * Desativa um neurocore (soft delete)
 * @param neurocoreId - ID do neurocore
 * @returns Neurocore desativado
 */
export async function deactivateNeurocore(neurocoreId: string) {
  return updateNeurocore(neurocoreId, { is_active: false })
}

/**
 * Ativa um neurocore
 * @param neurocoreId - ID do neurocore
 * @returns Neurocore ativado
 */
export async function activateNeurocore(neurocoreId: string) {
  return updateNeurocore(neurocoreId, { is_active: true })
}

/**
 * Alterna o status ativo/inativo do neurocore
 * @param neurocoreId - ID do neurocore
 * @param status - Novo status
 * @returns Neurocore atualizado
 */
export async function toggleNeurocoreStatus(neurocoreId: string, status: boolean) {
  return updateNeurocore(neurocoreId, { is_active: status })
}
