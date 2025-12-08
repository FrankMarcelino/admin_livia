/**
 * ChannelFormDialog Component
 * Dialog wrapper para formulário de criação/edição de canais
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChannelForm } from './ChannelForm'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface ChannelFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  channel?: ChannelWithProvider | null
  onSuccess: () => void
}

/**
 * Dialog para criar/editar canal
 */
export function ChannelFormDialog({
  open,
  onOpenChange,
  tenantId,
  channel,
  onSuccess
}: ChannelFormDialogProps) {
  const isEditing = !!channel

  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Canal' : 'Novo Canal WhatsApp'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as configurações do canal abaixo.'
              : 'Preencha as informações para cadastrar um novo canal de comunicação.'}
          </DialogDescription>
        </DialogHeader>

        <ChannelForm
          tenantId={tenantId}
          channel={channel}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
