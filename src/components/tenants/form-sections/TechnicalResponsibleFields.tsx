/**
 * TechnicalResponsibleFields Component
 * Campos do responsável técnico
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

interface TechnicalResponsibleFieldsProps {
  form: UseFormReturn<TenantCreateInput>
}

export function TechnicalResponsibleFields({ form }: TechnicalResponsibleFieldsProps) {
  return (
    <>
      {/* Nome */}
      <FormField
        control={form.control}
        name="responsible_tech_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Responsável Técnico *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: João Silva" {...field} />
            </FormControl>
            <FormDescription>
              Nome completo do responsável técnico
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* WhatsApp */}
      <FormField
        control={form.control}
        name="responsible_tech_whatsapp"
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
        name="responsible_tech_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="tecnico@empresa.com" {...field} />
            </FormControl>
            <FormDescription>
              Email de contato do responsável técnico
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
