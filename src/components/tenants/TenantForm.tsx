/**
 * TenantForm Component
 * Formulário de criação/edição de tenants com validação
 * Estrutura hierárquica de tabs:
 * - Nível 1 (Main): TENANT | CHANNELS | USUÁRIOS
 * - Nível 2 (Sub): Dentro de cada main tab
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useTenantStore } from '@/store/tenant'
import { TenantWithRelations } from '@/types/tenant-extended.types'
import { tenantCreateSchema, TenantCreateInput, unformatCNPJ } from '@/lib/validations/tenantValidation'
import { fetchActiveNeurocores, fetchNiches } from '@/lib/queries/tenantQueries'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { TenantInfoTab } from './tabs/TenantInfoTab'
import { ChannelsTab } from './tabs/ChannelsTab'
import { UsersTab } from './tabs/UsersTab'

interface TenantFormProps {
  tenant?: TenantWithRelations | null
  onSuccess: () => void
  onCancel: () => void
}

export function TenantForm({ tenant, onSuccess, onCancel }: TenantFormProps) {
  const { createTenant, updateTenant, isLoading } = useTenantStore()
  const [neurocores, setNeurocores] = useState<{ id: string; name: string }[]>([])
  const [niches, setNiches] = useState<{ id: string; name: string }[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const isEditing = !!tenant

  // Form setup
  const form = useForm<TenantCreateInput>({
    resolver: zodResolver(tenantCreateSchema),
    defaultValues: tenant
      ? {
          name: tenant.name,
          cnpj: tenant.cnpj,
          phone: tenant.phone,
          responsible_tech_name: tenant.responsible_tech_name,
          responsible_tech_whatsapp: tenant.responsible_tech_whatsapp,
          responsible_tech_email: tenant.responsible_tech_email,
          responsible_finance_name: tenant.responsible_finance_name,
          responsible_finance_whatsapp: tenant.responsible_finance_whatsapp,
          responsible_finance_email: tenant.responsible_finance_email,
          neurocore_id: tenant.neurocore_id,
          niche_id: tenant.niche_id || undefined,
          plan: tenant.plan
        }
      : {
          name: '',
          cnpj: '',
          phone: '',
          responsible_tech_name: '',
          responsible_tech_whatsapp: '',
          responsible_tech_email: '',
          responsible_finance_name: '',
          responsible_finance_whatsapp: '',
          responsible_finance_email: '',
          neurocore_id: '',
          niche_id: undefined,
          plan: 'basic'
        }
  })

  // Load neurocores and niches
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true)
      try {
        const [neurocoresData, nichesData] = await Promise.all([
          fetchActiveNeurocores(),
          fetchNiches()
        ])
        setNeurocores(neurocoresData)
        setNiches(nichesData)
      } catch (error) {
        console.error('Error loading form data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [])

  // Submit handler
  async function onSubmit(data: TenantCreateInput) {
    // Remove formatting from CNPJ before sending and convert undefined to null
    const cleanedData = {
      ...data,
      cnpj: unformatCNPJ(data.cnpj),
      niche_id: data.niche_id || null,
      is_active: true, // Default to active on creation
      master_integration_active: false // Default to inactive
    }

    let result
    if (isEditing) {
      result = await updateTenant(tenant.id, cleanedData)
    } else {
      result = await createTenant(cleanedData)
    }

    if (result) {
      onSuccess()
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* MAIN TABS - NÍVEL 1 */}
        <Tabs defaultValue="tenant" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tenant">Tenant</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="users" disabled>Usuários</TabsTrigger>
          </TabsList>

          {/* TAB 1: TENANT INFO (com sub-tabs) */}
          <TabsContent value="tenant">
            <TenantInfoTab
              form={form}
              neurocores={neurocores}
              niches={niches}
            />
          </TabsContent>

          {/* TAB 2: CHANNELS */}
          <TabsContent value="channels">
            <ChannelsTab tenantId={tenant?.id} />
          </TabsContent>

          {/* TAB 3: USERS (Placeholder) */}
          <TabsContent value="users">
            <UsersTab tenantId={tenant?.id} />
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Empresa
          </Button>
        </div>

        {/* Validation Errors Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Corrija os seguintes erros:</p>
            <ul className="list-disc list-inside mt-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  )
}
