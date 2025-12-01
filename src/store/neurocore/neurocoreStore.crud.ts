/**
 * Neurocore Store - CRUD Actions
 * Ações de criação, leitura, atualização e exclusão de neurocores
 */

import { StateCreator } from 'zustand'
import { NeurocoreStore } from './neurocoreStore.types'
import * as neurocoreQueries from '@/lib/queries/neurocore'
import { toast } from '@/hooks/use-toast'
import { NeurocoreInsert, NeurocoreUpdate } from '@/types/database.types'

type CrudActions = Pick<NeurocoreStore,
  'fetchNeurocores' | 'fetchNeurocoreById' | 'createNeurocore' | 'updateNeurocore' | 'deleteNeurocore'
>

export const createCrudActions: StateCreator<NeurocoreStore, [], [], CrudActions> = (set, get) => ({
  // Buscar neurocores com filtros e paginação
  fetchNeurocores: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters, sort, pagination } = get()
      const { data, total } = await neurocoreQueries.fetchNeurocoresWithRelations(
        filters,
        sort,
        pagination.page,
        pagination.pageSize
      )

      set({
        neurocores: data,
        pagination: { ...pagination, total },
        isLoading: false
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar neurocores'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar neurocores',
        description: errorMessage
      })
    }
  },

  // Buscar neurocore específico por ID
  fetchNeurocoreById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const neurocore = await neurocoreQueries.fetchNeurocoreById(id)
      set({
        selectedNeurocore: neurocore,
        isLoading: false
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar neurocore',
        description: errorMessage
      })
    }
  },

  // Criar novo neurocore
  createNeurocore: async (data: NeurocoreInsert) => {
    set({ isLoading: true, error: null })
    try {
      // Verificar se ID do Workflow N8N já existe
      const workflowIdExists = await neurocoreQueries.checkWorkflowIdExists(data.id_subwork_n8n_neurocore)
      if (workflowIdExists) {
        toast({
          variant: 'destructive',
          title: 'ID do Workflow já cadastrado',
          description: 'Este ID do Workflow N8N já está cadastrado no sistema'
        })
        set({ isLoading: false })
        return null
      }

      const neurocore = await neurocoreQueries.createNeurocore(data)

      // Atualizar lista de neurocores
      set(state => ({
        neurocores: [neurocore, ...state.neurocores],
        isLoading: false
      }))

      toast({
        title: 'Neurocore criado com sucesso',
        description: `${neurocore.name} foi cadastrado no sistema`
      })

      return neurocore
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao criar neurocore',
        description: errorMessage
      })
      return null
    }
  },

  // Atualizar neurocore
  updateNeurocore: async (id: string, data: NeurocoreUpdate) => {
    set({ isLoading: true, error: null })
    try {
      // Se está atualizando ID do Workflow, verificar se já existe
      if (data.id_subwork_n8n_neurocore) {
        const workflowIdExists = await neurocoreQueries.checkWorkflowIdExists(data.id_subwork_n8n_neurocore, id)
        if (workflowIdExists) {
          toast({
            variant: 'destructive',
            title: 'ID do Workflow já cadastrado',
            description: 'Este ID do Workflow N8N já está cadastrado no sistema'
          })
          set({ isLoading: false })
          return null
        }
      }

      const updatedNeurocore = await neurocoreQueries.updateNeurocore(id, data)

      // Atualizar lista de neurocores
      set(state => ({
        neurocores: state.neurocores.map(n => n.id === id ? updatedNeurocore : n),
        selectedNeurocore: state.selectedNeurocore?.id === id ? updatedNeurocore : state.selectedNeurocore,
        isLoading: false
      }))

      toast({
        title: 'Neurocore atualizado',
        description: `${updatedNeurocore.name} foi atualizado com sucesso`
      })

      return updatedNeurocore
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar neurocore',
        description: errorMessage
      })
      return null
    }
  },

  // Deletar neurocore
  deleteNeurocore: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await neurocoreQueries.deleteNeurocore(id)

      // Remover da lista
      set(state => ({
        neurocores: state.neurocores.filter(n => n.id !== id),
        selectedNeurocore: state.selectedNeurocore?.id === id ? null : state.selectedNeurocore,
        isLoading: false
      }))

      toast({
        title: 'Neurocore excluído',
        description: 'O neurocore foi excluído com sucesso'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir neurocore'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir neurocore',
        description: errorMessage
      })
    }
  }
})
