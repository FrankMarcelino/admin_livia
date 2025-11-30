/**
 * TenantTable Component
 * Tabela de listagem de tenants com ações
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
import { TenantWithRelations } from '@/types/tenant-extended.types'
import { formatCNPJ } from '@/lib/validations/tenantValidation'
import { MoreHorizontal, Eye, Edit, Power, PowerOff } from 'lucide-react'
import { format } from 'date-fns'

interface TenantTableProps {
  tenants: TenantWithRelations[]
  isLoading: boolean
  onEdit: (tenant: TenantWithRelations) => void
  onView: (tenant: TenantWithRelations) => void
  onToggleStatus: (tenant: TenantWithRelations) => void
}

export function TenantTable({
  tenants,
  isLoading,
  onEdit,
  onView,
  onToggleStatus
}: TenantTableProps) {
  // Plan badge variant
  const getPlanBadge = (plan: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      basic: { variant: 'secondary', label: 'Basic' },
      pro: { variant: 'default', label: 'Pro' },
      enterprise: { variant: 'destructive', label: 'Enterprise' }
    }
    return variants[plan] || variants.basic
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Neurocore</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
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
  if (tenants.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma empresa encontrada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tente ajustar os filtros ou criar uma nova empresa
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
            <TableHead>CNPJ</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Neurocore</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[70px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => {
            const planBadge = getPlanBadge(tenant.plan)

            return (
              <TableRow key={tenant.id} className="hover:bg-muted/50">
                {/* Nome */}
                <TableCell className="font-medium">
                  {tenant.name}
                </TableCell>

                {/* CNPJ */}
                <TableCell className="text-muted-foreground">
                  {formatCNPJ(tenant.cnpj)}
                </TableCell>

                {/* Plano */}
                <TableCell>
                  <Badge variant={planBadge.variant}>
                    {planBadge.label}
                  </Badge>
                </TableCell>

                {/* Neurocore */}
                <TableCell className="text-sm">
                  {tenant.neurocore?.name || '-'}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                    {tenant.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>

                {/* Data de Criação */}
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(tenant.created_at), 'dd/MM/yyyy')}
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
                      <DropdownMenuItem onClick={() => onView(tenant)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(tenant)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(tenant)}>
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
