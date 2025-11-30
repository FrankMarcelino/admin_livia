/**
 * TenantForm Component
 * Formulário de criação/edição de tenants com validação
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
import { BasicInfoFields } from './form-sections/BasicInfoFields'
import { TechnicalResponsibleFields } from './form-sections/TechnicalResponsibleFields'
import { FinancialResponsibleFields } from './form-sections/FinancialResponsibleFields'
import { ConfigurationFields } from './form-sections/ConfigurationFields'

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
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="tech">Téc. Responsável</TabsTrigger>
            <TabsTrigger value="finance">Fin. Responsável</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoFields form={form} />
          </TabsContent>

          <TabsContent value="tech" className="space-y-4 mt-4">
            <TechnicalResponsibleFields form={form} />
          </TabsContent>

          <TabsContent value="finance" className="space-y-4 mt-4">
            <FinancialResponsibleFields form={form} />
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <ConfigurationFields
              form={form}
              neurocores={neurocores}
              niches={niches}
            />
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
