/**
 * Tenant Queries - Lookup Tables
 * Queries para buscar dados de tabelas relacionadas (neurocores, niches)
 */

import { supabase } from '@/lib/supabase'

/**
 * Busca todos os neurocores ativos para o select do formulário
 * @returns Lista de neurocores ativos
 */
export async function fetchActiveNeurocores() {
  const { data, error } = await supabase
    .from('neurocores')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching neurocores:', error)
    throw error
  }

  return data || []
}

/**
 * Busca todos os nichos para o select do formulário
 * @returns Lista de nichos
 */
export async function fetchNiches() {
  const { data, error } = await supabase
    .from('niches')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error fetching niches:', error)
    throw error
  }

  return data || []
}
