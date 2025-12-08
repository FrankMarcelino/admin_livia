/**
 * ChannelTechnicalSection Component
 * Seção de configurações técnicas e avançadas
 */

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { UseFormReturn } from 'react-hook-form'
import type { ChannelCreateInput } from '@/lib/validations/channelValidation'

interface ChannelTechnicalSectionProps {
  form: UseFormReturn<ChannelCreateInput>
}

/**
 * Seção de configurações técnicas
 */
export function ChannelTechnicalSection({ form }: ChannelTechnicalSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Configurações Técnicas e Avançadas</h3>
        <p className="text-sm text-muted-foreground">
          Configurações de integração com o provedor
        </p>
      </div>

      {/* URL Externa da API */}
      <FormField
        control={form.control}
        name="external_api_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Externa da API *</FormLabel>
            <FormControl>
              <Input placeholder="https://api.provider.com/v1" {...field} />
            </FormControl>
            <FormDescription>
              URL base da API do provedor de canal
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ID Externo do Provedor */}
      <FormField
        control={form.control}
        name="provider_external_channel_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Externo do Provedor de Canal *</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: a92c93d4-c016-g7b8-a9c0" {...field} />
            </FormControl>
            <FormDescription>
              Identificador único do canal no provedor
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descrição do Cliente */}
      <FormField
        control={form.control}
        name="identification_channel_client_descriptions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição do Cliente do Canal de Identificação</FormLabel>
            <FormControl>
              <Input
                placeholder="Descrição para identificação interna do cliente..."
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormDescription>
              Descrição adicional para identificação interna (opcional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fragmentos de Tempo de Espera */}
      <FormField
        control={form.control}
        name="message_wait_time_fragments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fragmentos de Tempo de Espera de Mensagem (segundos) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="60"
                placeholder="8"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 8)}
              />
            </FormControl>
            <FormDescription>
              Tempo de espera entre fragmentos de mensagem (1-60 segundos)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
