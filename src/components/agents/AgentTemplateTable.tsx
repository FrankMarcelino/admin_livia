/**
 * AgentTemplateTable Component
 * Tabela de listagem de templates de agents com ações inline
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Eye,
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  Bot
} from 'lucide-react'
import { AgentTemplate } from '@/types/agent-template-extended.types'
import { AgentFunction } from '@/types/database.types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AgentTemplateTableProps {
  templates: AgentTemplate[]
  isLoading: boolean
  onViewDetails: (template: AgentTemplate) => void
  onEdit: (template: AgentTemplate) => void
  onToggleStatus: (template: AgentTemplate) => void
}

export function AgentTemplateTable({
  templates,
  isLoading,
  onViewDetails,
  onEdit,
  onToggleStatus
}: AgentTemplateTableProps) {
  // Loading state
  if (isLoading) {
    return <TableSkeleton />
  }

  // Empty state
  if (!templates || templates.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="Nenhum template encontrado"
        description="Crie seu primeiro template de agent para começar"
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Modo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              {/* Nome */}
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{template.name}</span>
                  {template.objective && (
                    <span className="text-xs text-muted-foreground">
                      {template.objective.length > 50
                        ? `${template.objective.substring(0, 50)}...`
                        : template.objective}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Tipo */}
              <TableCell>
                <Badge variant={getTypeVariant(template.type)}>
                  {getTypeLabel(template.type)}
                </Badge>
              </TableCell>

              {/* Modo */}
              <TableCell>
                <Badge variant={template.reactive ? 'secondary' : 'default'}>
                  {template.reactive ? 'Reativo' : 'Proativo'}
                </Badge>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                  {template.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>

              {/* Criado em */}
              <TableCell className="text-muted-foreground">
                {format(new Date(template.created_at), 'dd/MM/yyyy', {
                  locale: ptBR
                })}
              </TableCell>

              {/* Ações */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewDetails(template)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(template)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleStatus(template)}>
                      {template.is_active ? (
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
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Table skeleton for loading state
 */
function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Modo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[200px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-[70px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-[60px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[90px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Helper functions
 */
function getTypeLabel(type: AgentFunction): string {
  const labels: Record<AgentFunction, string> = {
    attendant: 'Atendente',
    intention: 'Intenção',
    in_guard_rails: 'Guard Rails',
    observer: 'Observador'
  }
  return labels[type] || type
}

function getTypeVariant(type: AgentFunction): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<AgentFunction, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    attendant: 'default',
    intention: 'secondary',
    in_guard_rails: 'outline',
    observer: 'destructive'
  }
  return variants[type] || 'default'
}
