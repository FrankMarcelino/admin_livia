/**
 * Tenant Store - Status Actions
 * Ações para gerenciar status de tenants (ativar/desativar, integração master)
 */

import { StateCreator } from 'zustand'
import { TenantStore } from './tenantStore.types'
import * as tenantQueries from '@/lib/queries/tenantQueries'
import { toast } from '@/hooks/use-toast'

type StatusActions = Pick<TenantStore,
  'activateTenant' | 'deactivateTenant' | 'toggleMasterIntegration'
>

export const createStatusActions: StateCreator<TenantStore, [], [], StatusActions> = (set) => ({
  // Ativar tenant
  activateTenant: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const tenant = await tenantQueries.activateTenant(id)

      set(state => ({
        tenants: state.tenants.map(t => t.id === id ? tenant : t),
        selectedTenant: state.selectedTenant?.id === id ? tenant : state.selectedTenant,
        isLoading: false
      }))

      toast({
        title: 'Empresa ativada',
        description: `${tenant.name} foi ativada com sucesso`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao ativar empresa'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao ativar empresa',
        description: errorMessage
      })
    }
  },

  // Desativar tenant
  deactivateTenant: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const tenant = await tenantQueries.deactivateTenant(id)

      set(state => ({
        tenants: state.tenants.map(t => t.id === id ? tenant : t),
        selectedTenant: state.selectedTenant?.id === id ? tenant : state.selectedTenant,
        isLoading: false
      }))

      toast({
        title: 'Empresa desativada',
        description: `${tenant.name} foi desativada com sucesso`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao desativar empresa'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao desativar empresa',
        description: errorMessage
      })
    }
  },

  // Alternar integração master
  toggleMasterIntegration: async (id: string, status: boolean) => {
    set({ isLoading: true, error: null })
    try {
      const tenant = await tenantQueries.toggleMasterIntegration(id, status)

      set(state => ({
        tenants: state.tenants.map(t => t.id === id ? tenant : t),
        selectedTenant: state.selectedTenant?.id === id ? tenant : state.selectedTenant,
        isLoading: false
      }))

      toast({
        title: 'Integração master atualizada',
        description: `Integração master ${status ? 'ativada' : 'desativada'} para ${tenant.name}`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar integração'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar integração',
        description: errorMessage
      })
    }
  }
})
