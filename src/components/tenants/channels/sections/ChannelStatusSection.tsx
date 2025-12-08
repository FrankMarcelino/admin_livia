/**
 * ChannelStatusSection Component
 * Seção de status e observações do canal
 */

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormReturn } from 'react-hook-form'
import type { ChannelCreateInput } from '@/lib/validations/channelValidation'

interface ChannelStatusSectionProps {
  form: UseFormReturn<ChannelCreateInput>
}

/**
 * Seção de status e observações
 */
export function ChannelStatusSection({ form }: ChannelStatusSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Status e Observações</h3>
        <p className="text-sm text-muted-foreground">
          Configure o status de operação do canal
        </p>
      </div>

      {/* Canal Ativo */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Canal Ativo</FormLabel>
              <FormDescription>
                Canal está habilitado para operação
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

      {/* Recebendo Mensagens */}
      <FormField
        control={form.control}
        name="is_receiving_messages"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Recebendo Mensagens</FormLabel>
              <FormDescription>
                Canal pode receber mensagens dos clientes
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

      {/* Enviando Mensagens */}
      <FormField
        control={form.control}
        name="is_sending_messages"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enviando Mensagens</FormLabel>
              <FormDescription>
                Canal pode enviar mensagens para os clientes
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

      {/* Observações */}
      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Adicione notas ou observações importantes sobre este canal..."
                className="min-h-[100px] resize-none"
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>
              Informações adicionais sobre o canal (opcional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
