/**
 * ChannelsTab Component
 * Tab para gerenciamento de canais do tenant
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useChannelStore } from '@/store/channel'
import { ChannelList } from '../channels/ChannelList'
import { ChannelFormDialog } from '../channels/ChannelFormDialog'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface ChannelsTabProps {
  tenantId?: string
}

/**
 * Tab de gerenciamento de canais
 */
export function ChannelsTab({ tenantId }: ChannelsTabProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingChannel, setEditingChannel] = useState<ChannelWithProvider | null>(null)
  const { channels, fetchChannelsByTenant, isLoading, deleteChannel } = useChannelStore()

  // Carregar canais quando tenantId está disponível
  useEffect(() => {
    if (tenantId) {
      fetchChannelsByTenant(tenantId)
    }
  }, [tenantId, fetchChannelsByTenant])

  // Se tenant ainda não foi criado
  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="rounded-full bg-muted p-3">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-muted-foreground">
            Salve a empresa primeiro para adicionar canais
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Você poderá adicionar canais WhatsApp após criar o cadastro da empresa.
          </p>
        </div>
      </div>
    )
  }

  const handleEdit = (channel: ChannelWithProvider) => {
    setEditingChannel(channel)
  }

  const handleDelete = async (channel: ChannelWithProvider) => {
    if (confirm(`Tem certeza que deseja remover o canal "${channel.name}"?`)) {
      const success = await deleteChannel(channel.id)
      if (success && tenantId) {
        fetchChannelsByTenant(tenantId)
      }
    }
  }

  const handleSuccess = () => {
    setIsCreating(false)
    setEditingChannel(null)
    if (tenantId) {
      fetchChannelsByTenant(tenantId)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Canais WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os canais de comunicação desta empresa
          </p>
        </div>
        <Button type="button" onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Canal
        </Button>
      </div>

      {/* Lista de canais */}
      <ChannelList
        channels={channels}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialog de criação/edição */}
      <ChannelFormDialog
        open={isCreating || !!editingChannel}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false)
            setEditingChannel(null)
          }
        }}
        tenantId={tenantId!}
        channel={editingChannel}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
