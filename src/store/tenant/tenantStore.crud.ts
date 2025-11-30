/**
 * Tenant Store - CRUD Actions
 * Ações de criação, leitura, atualização e exclusão de tenants
 */

import { StateCreator } from 'zustand'
import { TenantStore } from './tenantStore.types'
import * as tenantQueries from '@/lib/queries/tenantQueries'
import { toast } from '@/hooks/use-toast'
import { TenantInsert, TenantUpdate } from '@/types/database.types'

type CrudActions = Pick<TenantStore,
  'fetchTenants' | 'fetchTenantById' | 'createTenant' | 'updateTenant' | 'deleteTenant'
>

export const createCrudActions: StateCreator<TenantStore, [], [], CrudActions> = (set, get) => ({
  // Buscar tenants com filtros e paginação
  fetchTenants: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters, sort, pagination } = get()
      const { data, total } = await tenantQueries.fetchTenantsWithRelations(
        filters,
        sort,
        pagination.page,
        pagination.pageSize
      )

      set({
        tenants: data,
        pagination: { ...pagination, total },
        isLoading: false
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar empresas'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar empresas',
        description: errorMessage
      })
    }
  },

  // Buscar tenant específico por ID
  fetchTenantById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const tenant = await tenantQueries.fetchTenantById(id)
      set({
        selectedTenant: tenant,
        isLoading: false
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar empresa'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar empresa',
        description: errorMessage
      })
    }
  },

  // Criar novo tenant
  createTenant: async (data: TenantInsert) => {
    set({ isLoading: true, error: null })
    try {
      // Verificar se CNPJ já existe
      const cnpjExists = await tenantQueries.checkCNPJExists(data.cnpj)
      if (cnpjExists) {
        toast({
          variant: 'destructive',
          title: 'CNPJ já cadastrado',
          description: 'Este CNPJ já está cadastrado no sistema'
        })
        set({ isLoading: false })
        return null
      }

      const tenant = await tenantQueries.createTenant(data)

      // Atualizar lista de tenants
      set(state => ({
        tenants: [tenant, ...state.tenants],
        isLoading: false
      }))

      toast({
        title: 'Empresa criada com sucesso',
        description: `${tenant.name} foi cadastrada no sistema`
      })

      return tenant
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar empresa'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao criar empresa',
        description: errorMessage
      })
      return null
    }
  },

  // Atualizar tenant
  updateTenant: async (id: string, data: TenantUpdate) => {
    set({ isLoading: true, error: null })
    try {
      // Se está atualizando CNPJ, verificar se já existe
      if (data.cnpj) {
        const cnpjExists = await tenantQueries.checkCNPJExists(data.cnpj, id)
        if (cnpjExists) {
          toast({
            variant: 'destructive',
            title: 'CNPJ já cadastrado',
            description: 'Este CNPJ já está cadastrado no sistema'
          })
          set({ isLoading: false })
          return null
        }
      }

      const updatedTenant = await tenantQueries.updateTenant(id, data)

      // Atualizar lista de tenants
      set(state => ({
        tenants: state.tenants.map(t => t.id === id ? updatedTenant : t),
        selectedTenant: state.selectedTenant?.id === id ? updatedTenant : state.selectedTenant,
        isLoading: false
      }))

      toast({
        title: 'Empresa atualizada',
        description: `${updatedTenant.name} foi atualizada com sucesso`
      })

      return updatedTenant
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar empresa'
      set({ error: errorMessage, isLoading: false })
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar empresa',
        description: errorMessage
      })
      return null
    }
  },

  // Desativar tenant (soft delete)
  deleteTenant: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await tenantQueries.deactivateTenant(id)

      // Atualizar lista de tenants
      set(state => ({
        tenants: state.tenants.map(t =>
          t.id === id ? { ...t, is_active: false } : t
        ),
        selectedTenant: state.selectedTenant?.id === id
          ? { ...state.selectedTenant, is_active: false }
          : state.selectedTenant,
        isLoading: false
      }))

      toast({
        title: 'Empresa desativada',
        description: 'A empresa foi desativada com sucesso'
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
  }
})
