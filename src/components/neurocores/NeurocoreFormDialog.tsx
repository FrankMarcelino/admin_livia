/**
 * NeurocoreFormDialog Component
 * Dialog wrapper para formulário de criação/edição de neurocores
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NeurocoreForm } from './NeurocoreForm'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'

interface NeurocoreFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  neurocore?: NeurocoreWithRelations | null
  onSuccess?: () => void
}

export function NeurocoreFormDialog({
  open,
  onOpenChange,
  neurocore,
  onSuccess
}: NeurocoreFormDialogProps) {
  const isEditing = !!neurocore

  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Neurocore' : 'Novo Neurocore'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do neurocore e seus agents abaixo.'
              : 'Preencha as informações abaixo para cadastrar um novo neurocore.'}
          </DialogDescription>
        </DialogHeader>

        <NeurocoreForm
          neurocore={neurocore}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
