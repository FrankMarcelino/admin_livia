/**
 * NeurocoreDetailsDrawer Component
 * Drawer lateral para visualização detalhada de um neurocore
 */

import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Brain } from 'lucide-react'
import { NeurocoreDetailsHeader } from './details-sections/NeurocoreDetailsHeader'
import { NeurocoreDetailsInfo } from './details-sections/NeurocoreDetailsInfo'
import { NeurocoreDetailsStats } from './details-sections/NeurocoreDetailsStats'
import { NeurocoreDetailsAgents } from './details-sections/NeurocoreDetailsAgents'

interface NeurocoreDetailsDrawerProps {
  neurocore: NeurocoreWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (neurocore: NeurocoreWithRelations) => void
  onToggleStatus: (neurocore: NeurocoreWithRelations) => void
}

export function NeurocoreDetailsDrawer({
  neurocore,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
}: NeurocoreDetailsDrawerProps) {
  if (!neurocore) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {neurocore.name}
          </SheetTitle>
          <SheetDescription>
            Visualização detalhada do neurocore
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Actions */}
          <NeurocoreDetailsHeader
            neurocore={neurocore}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
          />

          <Separator />

          {/* Estatísticas */}
          <NeurocoreDetailsStats neurocore={neurocore} />

          <Separator />

          {/* Informações Básicas */}
          <NeurocoreDetailsInfo neurocore={neurocore} />

          <Separator />

          {/* Agents */}
          <NeurocoreDetailsAgents neurocore={neurocore} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
