/**
 * Agent Queries - CRUD Operations
 * Queries de criação, atualização e exclusão de agents
 */

import { supabase } from '@/lib/supabase'
import { Agent, AgentInsert, AgentUpdate } from '@/types/database.types'

/**
 * Cria um novo agent
 * @param agent - Dados do agent a criar (deve incluir id_neurocore)
 * @returns Agent criado
 */
export async function createAgent(agent: AgentInsert): Promise<Agent> {
  const { data, error } = await (supabase as any)
    .from('agents')
    .insert(agent)
    .select()
    .single()

  if (error) {
    console.error('Error creating agent:', error)
    throw error
  }

  return data as Agent
}

/**
 * Atualiza um agent existente
 * @param agentId - ID do agent
 * @param updates - Dados a atualizar
 * @returns Agent atualizado
 */
export async function updateAgent(agentId: string, updates: AgentUpdate): Promise<Agent> {
  const { data, error } = await (supabase as any)
    .from('agents')
    .update(updates)
    .eq('id', agentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating agent:', error)
    throw error
  }

  return data as Agent
}

/**
 * Deleta um agent
 * @param agentId - ID do agent
 */
export async function deleteAgent(agentId: string): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', agentId)

  if (error) {
    console.error('Error deleting agent:', error)
    throw error
  }
}

/**
 * Busca todos os agents de um neurocore
 * @param neurocoreId - ID do neurocore
 * @returns Lista de agents
 */
export async function fetchAgentsByNeurocore(neurocoreId: string): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id_neurocore', neurocoreId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching agents:', error)
    throw error
  }

  return data as Agent[]
}
