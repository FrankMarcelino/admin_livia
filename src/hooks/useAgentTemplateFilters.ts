import { useEffect, useState, useCallback } from 'react'
import { useAgentTemplateStore } from '@/store/agentTemplate'
import { AgentFunction } from '@/types/database.types'

/**
 * Custom hook for managing agent template filters with debounce
 *
 * Provides debounced search functionality and filter state management
 * for the agent template list page
 */
export function useAgentTemplateFilters() {
  const {
    filters,
    setSearch,
    setTypeFilter,
    setStatusFilter,
    resetFilters
  } = useAgentTemplateStore()

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(filters.search || '')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setSearch(searchInput)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchInput, filters.search, setSearch])

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
  }, [])

  // Handle type filter change
  const handleTypeChange = useCallback((value: string) => {
    if (value === 'all') {
      setTypeFilter(undefined)
    } else {
      setTypeFilter(value as AgentFunction)
    }
  }, [setTypeFilter])

  // Handle status filter change
  const handleStatusChange = useCallback((value: string) => {
    if (value === 'all') {
      setStatusFilter(undefined)
    } else {
      setStatusFilter(value === 'active')
    }
  }, [setStatusFilter])

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setSearchInput('')
    resetFilters()
  }, [resetFilters])

  return {
    // Current filter values
    searchValue: searchInput,
    typeValue: filters.type || 'all',
    statusValue: filters.is_active === undefined
      ? 'all'
      : filters.is_active
        ? 'active'
        : 'inactive',

    // Filter handlers
    onSearchChange: handleSearchChange,
    onTypeChange: handleTypeChange,
    onStatusChange: handleStatusChange,
    onResetFilters: handleResetFilters,

    // Check if any filter is active
    hasActiveFilters: Boolean(
      filters.search ||
      filters.type ||
      filters.is_active !== undefined
    )
  }
}
