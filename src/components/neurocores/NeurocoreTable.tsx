/**
 * NeurocoreTable Component
 * Tabela de listagem de neurocores com ações
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import { MoreHorizontal, Eye, Edit, Power, PowerOff, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface NeurocoreTableProps {
  neurocores: NeurocoreWithRelations[]
  isLoading: boolean
  onEdit: (neurocore: NeurocoreWithRelations) => void
  onView: (neurocore: NeurocoreWithRelations) => void
  onToggleStatus: (neurocore: NeurocoreWithRelations) => void
  onDelete: (neurocore: NeurocoreWithRelations) => void
}

export function NeurocoreTable({
  neurocores,
  isLoading,
  onEdit,
  onView,
  onToggleStatus,
  onDelete
}: NeurocoreTableProps) {
  // Truncate description for display
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>ID Workflow N8N</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Tenants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[40px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[40px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[35px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Empty state
  if (neurocores.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum neurocore encontrado
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tente ajustar os filtros ou criar um novo neurocore
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>ID Workflow N8N</TableHead>
            <TableHead>Agents</TableHead>
            <TableHead>Tenants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[70px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {neurocores.map((neurocore) => {
            const agentCount = neurocore.agents?.length || 0
            const tenantCount = neurocore.stats?.total_tenants || 0

            return (
              <TableRow key={neurocore.id} className="hover:bg-muted/50">
                {/* Nome */}
                <TableCell className="font-medium">
                  {neurocore.name}
                </TableCell>

                {/* Descrição */}
                <TableCell className="text-muted-foreground text-sm">
                  {truncateText(neurocore.description)}
                </TableCell>

                {/* ID Workflow N8N */}
                <TableCell className="font-mono text-xs">
                  {neurocore.id_subwork_n8n_neurocore}
                </TableCell>

                {/* Agents Count */}
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {agentCount}
                  </Badge>
                </TableCell>

                {/* Tenants Count */}
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {tenantCount}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={neurocore.is_active ? 'default' : 'secondary'}>
                    {neurocore.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>

                {/* Data de Criação */}
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(neurocore.created_at), 'dd/MM/yyyy')}
                </TableCell>

                {/* Ações */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(neurocore)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(neurocore)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(neurocore)}>
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
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(neurocore)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
