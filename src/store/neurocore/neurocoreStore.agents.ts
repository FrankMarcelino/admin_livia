/**
 * Neurocore Store - Agent Actions
 * Ações para gerenciar agents associados a neurocores
 */

import { StateCreator } from 'zustand'
import { NeurocoreStore } from './neurocoreStore.types'
import * as neurocoreQueries from '@/lib/queries/neurocore'
import { toast } from '@/hooks/use-toast'
import { AgentInsert, AgentUpdate } from '@/types/database.types'

type AgentActions = Pick<NeurocoreStore,
  'createAgent' | 'updateAgent' | 'deleteAgent'
>

export const createAgentActions: StateCreator<NeurocoreStore, [], [], AgentActions> = (set) => ({
  // Criar novo agent
  createAgent: async (data: AgentInsert) => {
    set({ isLoading: true, error: null })
    try {
      const agent = await neurocoreQueries.createAgent(data)

      // Atualizar lista de agents no neurocore selecionado
      set(state => {
        if (state.selectedNeurocore && state.selectedNeurocore.id === data.id_neurocore) {
          return {
            selectedNeurocore: {
              ...state.selectedNeurocore,
              agents: [...(state.selectedNeurocore.agents || []), agent]
            },
            isLoading: false
          }
        }
        return { isLoading: false }
      })

      toast({
        title: 'Agent criado com sucesso',
        description: `${agent.name} foi adicionado ao neurocore`
      })

      return agent
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar agent'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao criar agent',
        description: errorMessage
      })
      return null
    }
  },

  // Atualizar agent
  updateAgent: async (id: string, data: AgentUpdate) => {
    set({ isLoading: true, error: null })
    try {
      const updatedAgent = await neurocoreQueries.updateAgent(id, data)

      // Atualizar lista de agents no neurocore selecionado
      set(state => {
        if (state.selectedNeurocore) {
          return {
            selectedNeurocore: {
              ...state.selectedNeurocore,
              agents: state.selectedNeurocore.agents?.map(a =>
                a.id === id ? updatedAgent : a
              )
            },
            isLoading: false
          }
        }
        return { isLoading: false }
      })

      toast({
        title: 'Agent atualizado',
        description: `${updatedAgent.name} foi atualizado com sucesso`
      })

      return updatedAgent
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar agent'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar agent',
        description: errorMessage
      })
      return null
    }
  },

  // Deletar agent
  deleteAgent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await neurocoreQueries.deleteAgent(id)

      // Remover da lista de agents no neurocore selecionado
      set(state => {
        if (state.selectedNeurocore) {
          return {
            selectedNeurocore: {
              ...state.selectedNeurocore,
              agents: state.selectedNeurocore.agents?.filter(a => a.id !== id)
            },
            isLoading: false
          }
        }
        return { isLoading: false }
      })

      toast({
        title: 'Agent excluído',
        description: 'O agent foi excluído com sucesso'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir agent'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir agent',
        description: errorMessage
      })
    }
  }
})
