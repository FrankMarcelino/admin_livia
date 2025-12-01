/**
 * Neurocore Store - Status Actions
 * Ações para gerenciar status de neurocores (ativar/desativar)
 */

import { StateCreator } from 'zustand'
import { NeurocoreStore } from './neurocoreStore.types'
import * as neurocoreQueries from '@/lib/queries/neurocore'
import { toast } from '@/hooks/use-toast'

type StatusActions = Pick<NeurocoreStore,
  'activateNeurocore' | 'deactivateNeurocore' | 'toggleNeurocoreStatus'
>

export const createStatusActions: StateCreator<NeurocoreStore, [], [], StatusActions> = (set) => ({
  // Ativar neurocore
  activateNeurocore: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const neurocore = await neurocoreQueries.activateNeurocore(id)

      set(state => ({
        neurocores: state.neurocores.map(n => n.id === id ? neurocore : n),
        selectedNeurocore: state.selectedNeurocore?.id === id ? neurocore : state.selectedNeurocore,
        isLoading: false
      }))

      toast({
        title: 'Neurocore ativado',
        description: `${neurocore.name} foi ativado com sucesso`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao ativar neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao ativar neurocore',
        description: errorMessage
      })
    }
  },

  // Desativar neurocore
  deactivateNeurocore: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const neurocore = await neurocoreQueries.deactivateNeurocore(id)

      set(state => ({
        neurocores: state.neurocores.map(n => n.id === id ? neurocore : n),
        selectedNeurocore: state.selectedNeurocore?.id === id ? neurocore : state.selectedNeurocore,
        isLoading: false
      }))

      toast({
        title: 'Neurocore desativado',
        description: `${neurocore.name} foi desativado com sucesso`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao desativar neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao desativar neurocore',
        description: errorMessage
      })
    }
  },

  // Alternar status
  toggleNeurocoreStatus: async (id: string, status: boolean) => {
    set({ isLoading: true, error: null })
    try {
      const neurocore = await neurocoreQueries.toggleNeurocoreStatus(id, status)

      set(state => ({
        neurocores: state.neurocores.map(n => n.id === id ? neurocore : n),
        selectedNeurocore: state.selectedNeurocore?.id === id ? neurocore : state.selectedNeurocore,
        isLoading: false
      }))

      toast({
        title: 'Status atualizado',
        description: `${neurocore.name} foi ${status ? 'ativado' : 'desativado'}`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar status'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: errorMessage
      })
    }
  }
})
