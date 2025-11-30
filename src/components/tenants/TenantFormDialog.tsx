/**
 * TenantFormDialog Component
 * Dialog wrapper para formulário de criação/edição de tenants
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TenantForm } from './TenantForm'
import { TenantWithRelations } from '@/types/tenant-extended.types'

interface TenantFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: TenantWithRelations | null
  onSuccess?: () => void
}

export function TenantFormDialog({
  open,
  onOpenChange,
  tenant,
  onSuccess
}: TenantFormDialogProps) {
  const isEditing = !!tenant

  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações da empresa abaixo.'
              : 'Preencha as informações abaixo para cadastrar uma nova empresa.'}
          </DialogDescription>
        </DialogHeader>

        <TenantForm
          tenant={tenant}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
