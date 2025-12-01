/**
 * NeurocoreDetailsHeader Component
 * Header com ações rápidas (Editar, Ativar/Desativar)
 */

import { Button } from '@/components/ui/button'
import { Edit, Power, PowerOff } from 'lucide-react'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'

interface NeurocoreDetailsHeaderProps {
  neurocore: NeurocoreWithRelations
  onEdit: (neurocore: NeurocoreWithRelations) => void
  onToggleStatus: (neurocore: NeurocoreWithRelations) => void
}

export function NeurocoreDetailsHeader({
  neurocore,
  onEdit,
  onToggleStatus
}: NeurocoreDetailsHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onEdit(neurocore)}
        className="flex-1"
        variant="outline"
      >
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button
        onClick={() => onToggleStatus(neurocore)}
        className="flex-1"
        variant={neurocore.is_active ? 'destructive' : 'default'}
      >
        {neurocore.is_active ? (
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
