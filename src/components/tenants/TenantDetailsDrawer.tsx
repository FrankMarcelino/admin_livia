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
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
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
  Users,
  UserCircle,
  MessageCircle,
  Radio,
  BarChart3,
  Zap,
} from 'lucide-react'
import { formatCNPJ } from '@/lib/validations/tenantValidation'
import { formatDate } from '@/lib/utils'
import { useTenantStats } from '@/hooks/useTenantStats'
import { useTenantChannels } from '@/hooks/useTenantChannels'
import { useTenantStore } from '@/store/tenant'

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
  // Hooks
  const { stats, isLoading: isLoadingStats } = useTenantStats(tenant?.id || null)
  const { channels, isLoading: isLoadingChannels } = useTenantChannels(tenant?.id || null)
  const { toggleMasterIntegration } = useTenantStore()

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

  const handleToggleMasterIntegration = async (checked: boolean) => {
    await toggleMasterIntegration(tenant.id, checked)
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
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Integração Master
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Habilita recursos avançados de integração
                  </p>
                </div>
                <Switch
                  checked={tenant.master_integration_active}
                  onCheckedChange={handleToggleMasterIntegration}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Estatísticas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </h3>
            {isLoadingStats ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </Card>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-muted-foreground">Usuários</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_users}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCircle className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-muted-foreground">Contatos</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_contacts}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-muted-foreground">Conversas</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_conversations}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Radio className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-muted-foreground">Canais</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_channels}</p>
                </Card>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma estatística disponível</p>
            )}
          </div>

          <Separator />

          {/* Canais Configurados */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Canais Configurados
            </h3>
            {isLoadingChannels ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : channels.length > 0 ? (
              <div className="space-y-3">
                {channels.map((channel) => (
                  <Card key={channel.id} className="p-4">
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-base">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {channel.identification_number}
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant={channel.is_active ? 'default' : 'secondary'}>
                        {channel.is_active ? (
                          <>
                            <MessageSquare className="mr-1 h-3 w-3" /> Ativo
                          </>
                        ) : (
                          <>
                            <PowerOff className="mr-1 h-3 w-3" /> Inativo
                          </>
                        )}
                      </Badge>

                      {channel.is_receiving_messages && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Recebendo
                        </Badge>
                      )}

                      {channel.is_sending_messages && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <MessageCircle className="mr-1 h-3 w-3" />
                          Enviando
                        </Badge>
                      )}
                    </div>

                    {/* Detalhes */}
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Instância:</span>{' '}
                        {channel.instance_company_name}
                      </p>
                      {channel.channel_provider && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Provedor:</span>{' '}
                          {channel.channel_provider.name}
                        </p>
                      )}
                      {channel.observations && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Observações:</span>{' '}
                          {channel.observations}
                        </p>
                      )}
                    </div>

                    {/* Configurações Técnicas (colapsadas) */}
                    <details className="text-xs text-muted-foreground mt-2">
                      <summary className="cursor-pointer hover:text-foreground">
                        Ver configurações técnicas
                      </summary>
                      <div className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
                        <p>
                          <span className="font-medium">API URL:</span>{' '}
                          <span className="break-all">{channel.external_api_url}</span>
                        </p>
                        <p>
                          <span className="font-medium">ID Externo:</span>{' '}
                          {channel.provider_external_channel_id}
                        </p>
                        <p>
                          <span className="font-medium">Tempo de Espera:</span>{' '}
                          {channel.message_wait_time_fragments}s
                        </p>
                        {channel.identification_channel_client_descriptions && (
                          <p>
                            <span className="font-medium">Descrição do Cliente:</span>{' '}
                            {String(channel.identification_channel_client_descriptions)}
                          </p>
                        )}
                      </div>
                    </details>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Radio className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum canal configurado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione canais WhatsApp na aba Channels ao editar esta empresa
                </p>
              </div>
            )}
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
