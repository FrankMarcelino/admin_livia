/**
 * useTenantStats Hook
 * Hook para buscar estatísticas de um tenant (usuários, contatos, conversas, canais)
 */

import { useState, useEffect } from 'react'
import { fetchTenantStats } from '@/lib/queries/tenant'

interface TenantStats {
  total_users: number
  total_contacts: number
  total_conversations: number
  total_channels: number
}

interface UseTenantStatsReturn {
  stats: TenantStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar estatísticas de um tenant
 * @param tenantId - ID do tenant
 * @returns Estatísticas, loading state, error e função refetch
 */
export function useTenantStats(tenantId: string | null): UseTenantStatsReturn {
  const [stats, setStats] = useState<TenantStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      setStats(null)
      setIsLoading(false)
      return
    }

    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchTenantStats(tenantId)
        setStats(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas'
        setError(errorMessage)
        console.error('Error fetching tenant stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [tenantId])

  const refetch = async () => {
    if (!tenantId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTenantStats(tenantId)
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas'
      setError(errorMessage)
      console.error('Error fetching tenant stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    isLoading,
    error,
    refetch
  }
}
