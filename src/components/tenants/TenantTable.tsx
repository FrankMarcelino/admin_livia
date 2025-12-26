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
import { EmptyState } from '@/components/ui/empty-state'
import { TenantWithRelations } from '@/types/tenant-extended.types'
import { formatCNPJ } from '@/lib/validations/tenantValidation'
import { MoreHorizontal, Eye, Edit, Power, PowerOff, Trash2, Building2, Shield, Target, Settings } from 'lucide-react'
import { format } from 'date-fns'

interface TenantTableProps {
  tenants: TenantWithRelations[]
  isLoading: boolean
  onEdit: (tenant: TenantWithRelations) => void
  onView: (tenant: TenantWithRelations) => void
  onToggleStatus: (tenant: TenantWithRelations) => void
  onDelete: (tenant: TenantWithRelations) => void
  onConfigureGuardRails: (tenant: TenantWithRelations) => void
  onConfigureObserver: (tenant: TenantWithRelations) => void
  onConfigureIntention: (tenant: TenantWithRelations) => void
  onConfigureSystem: (tenant: TenantWithRelations) => void
}

export function TenantTable({
  tenants,
  isLoading,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
  onConfigureGuardRails,
  onConfigureObserver,
  onConfigureIntention,
  onConfigureSystem
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
        <EmptyState
          icon={Building2}
          title="Nenhuma empresa encontrada"
          description="Tente ajustar os filtros ou criar uma nova empresa para começar."
        />
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Nome</TableHead>
              <TableHead className="min-w-[140px]">CNPJ</TableHead>
              <TableHead className="min-w-[80px]">Plano</TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">Neurocore</TableHead>
              <TableHead className="min-w-[70px]">Status</TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => {
              const planBadge = getPlanBadge(tenant.plan)

              return (
                <TableRow key={tenant.id} className="hover:bg-muted/50 transition-colors">
                  {/* Nome */}
                  <TableCell className="font-medium">
                    <div className="max-w-[200px] truncate" title={tenant.name}>
                      {tenant.name}
                    </div>
                  </TableCell>

                  {/* CNPJ */}
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {formatCNPJ(tenant.cnpj)}
                  </TableCell>

                  {/* Plano */}
                  <TableCell>
                    <Badge variant={planBadge.variant} className="whitespace-nowrap">
                      {planBadge.label}
                    </Badge>
                  </TableCell>

                  {/* Neurocore */}
                  <TableCell className="text-sm hidden md:table-cell">
                    <div className="max-w-[120px] truncate" title={tenant.neurocore?.name}>
                      {tenant.neurocore?.name || '-'}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={tenant.is_active ? 'default' : 'secondary'} className="whitespace-nowrap">
                      {tenant.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>

                  {/* Data de Criação */}
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                    {format(new Date(tenant.created_at), 'dd/MM/yyyy')}
                  </TableCell>

                  {/* Ações */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu de ações para {tenant.name}</span>
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

                        <DropdownMenuItem onClick={() => onConfigureGuardRails(tenant)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Guard Rails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onConfigureObserver(tenant)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Observador
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onConfigureIntention(tenant)}>
                          <Target className="mr-2 h-4 w-4" />
                          Intenção
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onConfigureSystem(tenant)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Sistema
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
                        {tenant.is_active && (
                          <DropdownMenuItem
                            onClick={() => onDelete(tenant)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
