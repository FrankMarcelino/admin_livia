/**
 * NeurocoreDetailsInfo Component
 * Grid de informações básicas do neurocore
 */

import { Badge } from '@/components/ui/badge'
import { Brain, FileText, Code, Calendar } from 'lucide-react'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import { formatDate } from '@/lib/utils'

interface NeurocoreDetailsInfoProps {
  neurocore: NeurocoreWithRelations
}

export function NeurocoreDetailsInfo({ neurocore }: NeurocoreDetailsInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4" />
        Informações do Neurocore
      </h3>
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="text-sm text-muted-foreground">Nome</label>
          <p className="text-sm font-medium">{neurocore.name}</p>
        </div>

        {/* Descrição */}
        <div>
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Descrição
          </label>
          <p className="text-sm">
            {neurocore.description || (
              <span className="text-muted-foreground italic">Sem descrição</span>
            )}
          </p>
        </div>

        {/* ID Workflow N8N */}
        <div>
          <label className="text-sm text-muted-foreground flex items-center gap-1">
            <Code className="h-3 w-3" />
            ID do Workflow N8N
          </label>
          <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
            {neurocore.id_subwork_n8n_neurocore}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-muted-foreground">Status</label>
          <div className="mt-1">
            <Badge variant={neurocore.is_active ? 'default' : 'secondary'}>
              {neurocore.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>

        {/* Metadados */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Informações do Sistema
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Data de Criação</label>
              <p className="text-sm">{formatDate(neurocore.created_at)}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Última Atualização</label>
              <p className="text-sm">{formatDate(neurocore.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
