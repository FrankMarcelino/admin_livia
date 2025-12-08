/**
 * ChannelList Component
 * Lista de canais com estados de loading e empty
 */

import { Loader2 } from 'lucide-react'
import { ChannelCard } from './ChannelCard'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface ChannelListProps {
  channels: ChannelWithProvider[]
  isLoading: boolean
  onEdit: (channel: ChannelWithProvider) => void
  onDelete: (channel: ChannelWithProvider) => void
}

/**
 * Lista de canais
 */
export function ChannelList({ channels, isLoading, onEdit, onDelete }: ChannelListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Carregando canais...</p>
      </div>
    )
  }

  // Empty state
  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Nenhum canal cadastrado</p>
        <p className="text-sm text-muted-foreground mt-1">
          Clique em "Novo Canal" para adicionar um canal WhatsApp
        </p>
      </div>
    )
  }

  // List with channels
  return (
    <div className="space-y-3">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
