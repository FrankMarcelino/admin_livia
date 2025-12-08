/**
 * TenantInfoTab Component
 * Wrapper das sub-tabs de informações do tenant (Nível 2)
 * Encapsula: Básico | Téc. Responsável | Fin. Responsável | Configurações
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoFields } from '../form-sections/BasicInfoFields'
import { TechnicalResponsibleFields } from '../form-sections/TechnicalResponsibleFields'
import { FinancialResponsibleFields } from '../form-sections/FinancialResponsibleFields'
import { ConfigurationFields } from '../form-sections/ConfigurationFields'
import type { UseFormReturn } from 'react-hook-form'
import type { TenantCreateInput } from '@/lib/validations/tenantValidation'

interface TenantInfoTabProps {
  form: UseFormReturn<TenantCreateInput>
  neurocores: { id: string; name: string }[]
  niches: { id: string; name: string }[]
}

/**
 * Tab de informações do tenant com sub-tabs (Nível 2)
 */
export function TenantInfoTab({ form, neurocores, niches }: TenantInfoTabProps) {
  return (
    <Tabs defaultValue="basic" className="w-full mt-4">
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
  )
}
