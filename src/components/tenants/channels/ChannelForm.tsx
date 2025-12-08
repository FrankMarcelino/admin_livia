/**
 * ChannelForm Component
 * Formulário completo de criação/edição de canais
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useChannelStore } from '@/store/channel'
import { channelCreateSchema, type ChannelCreateInput } from '@/lib/validations/channelValidation'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { ChannelBasicInfoSection } from './sections/ChannelBasicInfoSection'
import { ChannelStatusSection } from './sections/ChannelStatusSection'
import { ChannelTechnicalSection } from './sections/ChannelTechnicalSection'
import type { ChannelWithProvider } from '@/lib/queries/channel'

interface ChannelFormProps {
  tenantId: string
  channel?: ChannelWithProvider | null
  onSuccess: () => void
  onCancel: () => void
}

/**
 * Formulário de canal com validação
 */
export function ChannelForm({ tenantId, channel, onSuccess, onCancel }: ChannelFormProps) {
  const { createChannel, updateChannel, isLoading, providers, fetchProviders } = useChannelStore()
  const [isLoadingData, setIsLoadingData] = useState(true)

  const isEditing = !!channel

  // Form setup
  const form = useForm<ChannelCreateInput>({
    resolver: zodResolver(channelCreateSchema),
    defaultValues: channel
      ? {
          tenant_id: channel.tenant_id,
          channel_provider_id: channel.channel_provider_id,
          name: channel.name,
          identification_number: channel.identification_number,
          instance_company_name: channel.instance_company_name,
          is_active: channel.is_active,
          is_receiving_messages: channel.is_receiving_messages,
          is_sending_messages: channel.is_sending_messages,
          observations: channel.observations || '',
          external_api_url: channel.external_api_url,
          provider_external_channel_id: channel.provider_external_channel_id,
          identification_channel_client_descriptions:
            (channel.identification_channel_client_descriptions as string) || '',
          message_wait_time_fragments: channel.message_wait_time_fragments ?? 8
        }
      : {
          tenant_id: tenantId,
          channel_provider_id: '',
          name: '',
          identification_number: '',
          instance_company_name: '',
          is_active: true,
          is_receiving_messages: true,
          is_sending_messages: true,
          observations: '',
          external_api_url: '',
          provider_external_channel_id: '',
          identification_channel_client_descriptions: '',
          message_wait_time_fragments: 8
        }
  })

  // Load providers
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true)
      try {
        await fetchProviders()
      } catch (error) {
        console.error('Error loading providers:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [fetchProviders])

  // Submit handler
  async function onSubmit(data: ChannelCreateInput, event?: React.BaseSyntheticEvent) {
    // Prevent event from bubbling to parent TenantForm
    event?.preventDefault()
    event?.stopPropagation()
    
    let result
    if (isEditing) {
      result = await updateChannel(channel.id, data)
    } else {
      result = await createChannel(data)
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
        {/* Seção: Informações Básicas */}
        <ChannelBasicInfoSection form={form} providers={providers} />

        {/* Seção: Status e Observações */}
        <ChannelStatusSection form={form} />

        {/* Seção: Configurações Técnicas */}
        <ChannelTechnicalSection form={form} />

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
            {isEditing ? 'Atualizar' : 'Criar'} Canal
          </Button>
        </div>

        {/* Validation Errors */}
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
