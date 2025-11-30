/**
 * BasicInfoFields Component
 * Campos de informações básicas do tenant
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TenantCreateInput } from '@/lib/validations/tenantValidation'

interface BasicInfoFieldsProps {
  form: UseFormReturn<TenantCreateInput>
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
      {/* Nome */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Empresa *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Empresa XPTO Ltda" {...field} />
            </FormControl>
            <FormDescription>
              Nome completo ou razão social da empresa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CNPJ */}
      <FormField
        control={form.control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ *</FormLabel>
            <FormControl>
              <Input placeholder="00.000.000/0000-00" {...field} />
            </FormControl>
            <FormDescription>
              CNPJ válido da empresa (apenas números ou formatado)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Telefone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone *</FormLabel>
            <FormControl>
              <Input placeholder="+5511999999999" {...field} />
            </FormControl>
            <FormDescription>
              Telefone principal no formato +5511999999999
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Plano */}
      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plano *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Plano contratado pela empresa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
