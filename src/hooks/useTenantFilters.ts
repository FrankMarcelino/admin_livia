/**
 * useTenantFilters Hook
 * Hook para gerenciar filtros de tenants com debounce de busca
 */

import { useState, useEffect, useCallback } from 'react'
import { TenantFilters } from '@/types/tenant-extended.types'
import { TenantPlan } from '@/types/database.types'

/**
 * Hook para gerenciar filtros de tenants
 * Implementa debounce de 300ms para o campo de busca
 *
 * @example
 * ```tsx
 * const { filters, handleSearchChange, handleFilterChange, clearFilters } = useTenantFilters()
 * ```
 */
export function useTenantFilters() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<TenantFilters>({
    search: '',
    plan: [],
    is_active: undefined,
    niche_id: undefined,
    neurocore_id: undefined
  })

  // Debounce do campo de busca (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Atualizar filtros quando debounced search mudar
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }))
  }, [debouncedSearch])

  /**
   * Atualiza o campo de busca (com debounce)
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
  }, [])

  /**
   * Atualiza os planos selecionados
   */
  const handlePlanChange = useCallback((plans: TenantPlan[]) => {
    setFilters(prev => ({ ...prev, plan: plans }))
  }, [])

  /**
   * Atualiza o filtro de status ativo/inativo
   */
  const handleActiveChange = useCallback((isActive: boolean | undefined) => {
    setFilters(prev => ({ ...prev, is_active: isActive }))
  }, [])

  /**
   * Atualiza o filtro de nicho
   */
  const handleNicheChange = useCallback((nicheId: string | undefined) => {
    setFilters(prev => ({ ...prev, niche_id: nicheId }))
  }, [])

  /**
   * Atualiza o filtro de neurocore
   */
  const handleNeurocoreChange = useCallback((neurocoreId: string | undefined) => {
    setFilters(prev => ({ ...prev, neurocore_id: neurocoreId }))
  }, [])

  /**
   * Atualiza múltiplos filtros de uma vez
   */
  const handleFilterChange = useCallback((newFilters: Partial<TenantFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  /**
   * Limpa todos os filtros
   */
  const clearFilters = useCallback(() => {
    setSearchInput('')
    setDebouncedSearch('')
    setFilters({
      search: '',
      plan: [],
      is_active: undefined,
      niche_id: undefined,
      neurocore_id: undefined
    })
  }, [])

  /**
   * Verifica se há filtros ativos
   */
  const hasActiveFilters = useCallback(() => {
    return (
      searchInput !== '' ||
      (filters.plan && filters.plan.length > 0) ||
      filters.is_active !== undefined ||
      filters.niche_id !== undefined ||
      filters.neurocore_id !== undefined
    )
  }, [searchInput, filters])

  return {
    filters,
    searchInput,
    handleSearchChange,
    handlePlanChange,
    handleActiveChange,
    handleNicheChange,
    handleNeurocoreChange,
    handleFilterChange,
    clearFilters,
    hasActiveFilters
  }
}
