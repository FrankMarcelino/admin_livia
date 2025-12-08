/**
 * useTenantChannels Hook
 * Hook para buscar canais configurados de um tenant
 */

import { useState, useEffect } from 'react'
import { fetchTenantChannels } from '@/lib/queries/tenant'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface UseTenantChannelsReturn {
  channels: ChannelWithProvider[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar canais de um tenant
 * @param tenantId - ID do tenant
 * @returns Lista de canais, loading state, error e função refetch
 */
export function useTenantChannels(tenantId: string | null): UseTenantChannelsReturn {
  const [channels, setChannels] = useState<ChannelWithProvider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      setChannels([])
      setIsLoading(false)
      return
    }

    const fetchChannels = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchTenantChannels(tenantId)
        setChannels(data as ChannelWithProvider[])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar canais'
        setError(errorMessage)
        console.error('Error fetching tenant channels:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannels()
  }, [tenantId])

  const refetch = async () => {
    if (!tenantId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTenantChannels(tenantId)
      setChannels(data as ChannelWithProvider[])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar canais'
      setError(errorMessage)
      console.error('Error fetching tenant channels:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    channels,
    isLoading,
    error,
    refetch
  }
}
