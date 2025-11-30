/**
 * TenantDetailsBasicInfo Component
 * Seção de informações básicas do tenant
 */

import { TenantWithRelations } from '@/types/tenant-extended.types'
import { Badge } from '@/components/ui/badge'
import { Building2, FileText, Phone } from 'lucide-react'
import { formatCNPJ } from '@/lib/validations/tenantValidation'

interface TenantDetailsBasicInfoProps {
  tenant: TenantWithRelations
}

export function TenantDetailsBasicInfo({ tenant }: TenantDetailsBasicInfoProps) {
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
  )
}
