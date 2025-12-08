/**
 * ChannelBasicInfoSection Component
 * Seção de informações básicas do canal
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UseFormReturn } from 'react-hook-form'
import type { ChannelCreateInput } from '@/lib/validations/channelValidation'

interface ChannelBasicInfoSectionProps {
  form: UseFormReturn<ChannelCreateInput>
  providers: Array<{ id: string; name: string; channel_provider_identifier_code: string }>
}

/**
 * Seção de informações básicas
 */
export function ChannelBasicInfoSection({ form, providers }: ChannelBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Informações Básicas</h3>
        <p className="text-sm text-muted-foreground">
          Dados principais de identificação do canal
        </p>
      </div>

      {/* Nome do Canal */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Canal *</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Atendimento VIP" {...field} />
            </FormControl>
            <FormDescription>
              Nome identificador do canal (ex: Atendimento Principal, Suporte)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Número de Identificação (WhatsApp) */}
      <FormField
        control={form.control}
        name="identification_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Identificação (WhatsApp) *</FormLabel>
            <FormControl>
              <Input placeholder="+55 11 98989-9999" {...field} />
            </FormControl>
            <FormDescription>
              Número WhatsApp no formato: +55 11 98989-9999
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nome da Empresa da Instância */}
      <FormField
        control={form.control}
        name="instance_company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Empresa da Instância *</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Acapulco FC" {...field} />
            </FormControl>
            <FormDescription>
              Nome da empresa/instância no provedor
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Provedor */}
      <FormField
        control={form.control}
        name="channel_provider_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provedor de Canal *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um provedor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Provedor de API do canal (Evolution API, etc)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
