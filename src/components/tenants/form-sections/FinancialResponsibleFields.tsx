/**
 * FinancialResponsibleFields Component
 * Campos do responsável financeiro
 */

import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TenantCreateInput } from '@/lib/validations/tenantValidation'

interface FinancialResponsibleFieldsProps {
  form: UseFormReturn<TenantCreateInput>
}

export function FinancialResponsibleFields({ form }: FinancialResponsibleFieldsProps) {
  return (
    <>
      {/* Nome */}
      <FormField
        control={form.control}
        name="responsible_finance_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Responsável Financeiro *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Maria Santos" {...field} />
            </FormControl>
            <FormDescription>
              Nome completo do responsável financeiro
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* WhatsApp */}
      <FormField
        control={form.control}
        name="responsible_finance_whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp *</FormLabel>
            <FormControl>
              <Input placeholder="+5511999999999" {...field} />
            </FormControl>
            <FormDescription>
              WhatsApp no formato +5511999999999
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="responsible_finance_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="financeiro@empresa.com" {...field} />
            </FormControl>
            <FormDescription>
              Email de contato do responsável financeiro
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
