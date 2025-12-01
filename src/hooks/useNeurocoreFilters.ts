/**
 * useNeurocoreFilters Hook
 * Hook para gerenciar filtros de neurocores com debounce de busca
 */

import { useState, useEffect, useCallback } from 'react'
import { NeurocoreFilters } from '@/types/neurocore-extended.types'

/**
 * Hook para gerenciar filtros de neurocores
 * Implementa debounce de 300ms para o campo de busca
 *
 * @example
 * ```tsx
 * const { filters, handleSearchChange, clearFilters } = useNeurocoreFilters()
 * ```
 */
export function useNeurocoreFilters() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<NeurocoreFilters>({
    search: '',
    is_active: undefined
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
   * Atualiza o filtro de status ativo/inativo
   */
  const handleActiveChange = useCallback((isActive: boolean | undefined) => {
    setFilters(prev => ({ ...prev, is_active: isActive }))
  }, [])

  /**
   * Atualiza múltiplos filtros de uma vez
   */
  const handleFilterChange = useCallback((newFilters: Partial<NeurocoreFilters>) => {
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
      is_active: undefined
    })
  }, [])

  /**
   * Verifica se há filtros ativos
   */
  const hasActiveFilters = useCallback(() => {
    return (
      searchInput !== '' ||
      filters.is_active !== undefined
    )
  }, [searchInput, filters])

  return {
    filters,
    searchInput,
    handleSearchChange,
    handleActiveChange,
    handleFilterChange,
    clearFilters,
    hasActiveFilters
  }
}
