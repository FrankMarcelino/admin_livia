/**
 * NeurocoreBasicFields Component
 * Campos básicos do formulário de neurocore
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { NeurocoreCreateInput } from '@/lib/validations/neurocoreValidation'

interface NeurocoreBasicFieldsProps {
  form: UseFormReturn<NeurocoreCreateInput>
}

export function NeurocoreBasicFields({ form }: NeurocoreBasicFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Nome */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Neurocore *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Neurocore Atendimento Médico" {...field} />
            </FormControl>
            <FormDescription>
              Nome descritivo que identifica este neurocore
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descrição */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva o propósito e características deste neurocore..."
                className="resize-none"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Informações adicionais sobre este neurocore (opcional, até 500 caracteres)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ID Workflow N8N */}
      <FormField
        control={form.control}
        name="id_subwork_n8n_neurocore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID do Workflow N8N *</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: workflow_neurocore_medical"
                className="font-mono"
                {...field}
              />
            </FormControl>
            <FormDescription>
              ID único do subworkflow no N8N (alfanumérico, hífens e underscores permitidos)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status Ativo/Inativo */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Status do Neurocore</FormLabel>
              <FormDescription>
                Define se este neurocore pode ser atribuído a novos tenants
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
