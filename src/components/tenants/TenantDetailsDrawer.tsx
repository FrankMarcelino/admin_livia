/**
 * TenantDetailsDrawer Component
 * Drawer lateral para visualização detalhada de um tenant
 */

import { TenantWithRelations } from '@/types/tenant-extended.types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  FileText,
  Phone,
  User,
  Mail,
  MessageSquare,
  Settings,
  Calendar,
  Edit,
  Power,
  PowerOff,
} from 'lucide-react'
import { formatCNPJ } from '@/lib/validations/tenantValidation'
import { formatDate } from '@/lib/utils'

interface TenantDetailsDrawerProps {
  tenant: TenantWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (tenant: TenantWithRelations) => void
  onToggleStatus: (tenant: TenantWithRelations) => void
}

export function TenantDetailsDrawer({
  tenant,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
}: TenantDetailsDrawerProps) {
  if (!tenant) return null

  const getPlanLabel = (plan: string) => {
    const labels = {
      basic: 'Básico',
      pro: 'Profissional',
      enterprise: 'Enterprise'
    }
    return labels[plan as keyof typeof labels] || plan
  }

  const getPlanBadgeVariant = (plan: string) => {
    const variants = {
      basic: 'secondary',
      pro: 'default',
      enterprise: 'destructive'
    }
    return variants[plan as keyof typeof variants] as 'secondary' | 'default' | 'destructive'
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {tenant.name}
          </SheetTitle>
          <SheetDescription>
            Visualização detalhada da empresa
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(tenant)}
              className="flex-1"
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              onClick={() => onToggleStatus(tenant)}
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

          <Separator />

          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Informações Básicas
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Nome da Empresa</label>
                <p className="text-sm font-medium">{tenant.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  CNPJ
                </label>
                <p className="text-sm font-medium">{formatCNPJ(tenant.cnpj)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Telefone
                </label>
                <p className="text-sm font-medium">{tenant.phone || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Plano</label>
                <div className="mt-1">
                  <Badge variant={getPlanBadgeVariant(tenant.plan)}>
                    {getPlanLabel(tenant.plan)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                    {tenant.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsável Técnico */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Responsável Técnico
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <p className="text-sm font-medium">{tenant.responsible_tech_name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  WhatsApp
                </label>
                <p className="text-sm font-medium">{tenant.responsible_tech_whatsapp}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </label>
                <p className="text-sm font-medium">{tenant.responsible_tech_email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsável Financeiro */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Responsável Financeiro
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <p className="text-sm font-medium">{tenant.responsible_finance_name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  WhatsApp
                </label>
                <p className="text-sm font-medium">{tenant.responsible_finance_whatsapp}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </label>
                <p className="text-sm font-medium">{tenant.responsible_finance_email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Neurocore</label>
                <p className="text-sm font-medium">
                  {tenant.neurocore?.name || 'Não informado'}
                  {tenant.neurocore && !tenant.neurocore.is_active && (
                    <Badge variant="secondary" className="ml-2">Inativo</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nicho</label>
                <p className="text-sm font-medium">{tenant.niche?.name || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadados */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informações do Sistema
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Data de Criação</label>
                <p className="text-sm font-medium">{formatDate(tenant.created_at)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Última Atualização</label>
                <p className="text-sm font-medium">{formatDate(tenant.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
