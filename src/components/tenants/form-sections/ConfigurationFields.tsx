/**
 * ConfigurationFields Component
 * Campos de configuração (neurocore e niche)
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TenantCreateInput } from '@/lib/validations/tenantValidation'

interface ConfigurationFieldsProps {
  form: UseFormReturn<TenantCreateInput>
  neurocores: { id: string; name: string }[]
  niches: { id: string; name: string }[]
}

export function ConfigurationFields({ form, neurocores, niches }: ConfigurationFieldsProps) {
  return (
    <>
      {/* Neurocore */}
      <FormField
        control={form.control}
        name="neurocore_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Neurocore *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um Neurocore" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {neurocores.map((neurocore) => (
                  <SelectItem key={neurocore.id} value={neurocore.id}>
                    {neurocore.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Neurocore associado a esta empresa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Niche */}
      <FormField
        control={form.control}
        name="niche_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nicho (Opcional)</FormLabel>
            <Select
              onValueChange={(value) => {
                // Converte "none" para undefined (que será null no banco)
                field.onChange(value === "none" ? undefined : value)
              }}
              value={field.value || "none"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nicho (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {niches.map((niche) => (
                  <SelectItem key={niche.id} value={niche.id}>
                    {niche.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Nicho de mercado da empresa (opcional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
