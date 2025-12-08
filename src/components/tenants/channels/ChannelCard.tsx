/**
 * ChannelCard Component
 * Card individual para exibir informações de um canal
 */

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, CheckCircle2, XCircle, MessageSquare, Send } from 'lucide-react'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface ChannelCardProps {
  channel: ChannelWithProvider
  onEdit: (channel: ChannelWithProvider) => void
  onDelete: (channel: ChannelWithProvider) => void
}

/**
 * Card de exibição de canal
 */
export function ChannelCard({ channel, onEdit, onDelete }: ChannelCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{channel.name}</h4>
          <p className="text-sm text-muted-foreground">
            {channel.identification_number}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(channel)}
            title="Editar canal"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(channel)}
            title="Remover canal"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={channel.is_active ? 'default' : 'secondary'}>
          {channel.is_active ? (
            <><CheckCircle2 className="mr-1 h-3 w-3" /> Ativo</>
          ) : (
            <><XCircle className="mr-1 h-3 w-3" /> Inativo</>
          )}
        </Badge>

        {channel.is_receiving_messages && (
          <Badge variant="outline">
            <MessageSquare className="mr-1 h-3 w-3" />
            Recebendo
          </Badge>
        )}

        {channel.is_sending_messages && (
          <Badge variant="outline">
            <Send className="mr-1 h-3 w-3" />
            Enviando
          </Badge>
        )}
      </div>

      {/* Detalhes */}
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium">Instância:</span> {channel.instance_company_name}
        </p>
        {channel.channel_provider && (
          <p className="text-muted-foreground">
            <span className="font-medium">Provedor:</span> {channel.channel_provider.name}
          </p>
        )}
        {channel.observations && (
          <p className="text-muted-foreground">
            <span className="font-medium">Obs:</span> {channel.observations}
          </p>
        )}
      </div>

      {/* Configurações Técnicas (colapsadas) */}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">
          Ver configurações técnicas
        </summary>
        <div className="mt-2 space-y-1 pl-4">
          <p><span className="font-medium">API URL:</span> {channel.external_api_url}</p>
          <p><span className="font-medium">ID Externo:</span> {channel.provider_external_channel_id}</p>
          <p><span className="font-medium">Tempo Espera:</span> {channel.message_wait_time_fragments}s</p>
        </div>
      </details>
    </div>
  )
}
