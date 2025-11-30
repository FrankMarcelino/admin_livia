/**
 * TenantDetailsHeader Component
 * Header com ações rápidas (editar e ativar/desativar)
 */

import { TenantWithRelations } from '@/types/tenant-extended.types'
import { Button } from '@/components/ui/button'
import { Edit, Power, PowerOff } from 'lucide-react'

interface TenantDetailsHeaderProps {
  tenant: TenantWithRelations
  onEdit: () => void
  onToggleStatus: () => void
}

export function TenantDetailsHeader({
  tenant,
  onEdit,
  onToggleStatus,
}: TenantDetailsHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onEdit}
        className="flex-1"
        variant="outline"
      >
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button
        onClick={onToggleStatus}
        className="flex-1"
        variant={tenant.is_active ? 'destructive' : 'default'}
      >
        {tenant.is_active ? (
          <>
            <PowerOff className="mr-2 h-4 w-4" />
            Desativar
          </>
        ) : (
          <>
            <Power className="mr-2 h-4 w-4" />
            Ativar
          </>
        )}
      </Button>
    </div>
  )
}
